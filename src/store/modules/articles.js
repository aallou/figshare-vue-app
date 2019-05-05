import FigShareService from "@/services/FigShareService.js";
import OrcidService from "@/services/OrcidService.js";
import ArticleUtils from "@/utils/ArticleUtils.js";

export default {
  state: {
    articles: [],
    categories: [],
    progress: false
  },
  mutations: {
    UPDATE_PROGRESS(state, value) {
      state.progress = value;
    },
    SET_ARTICLES(state, articles) {
      state.articles = articles;
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    UPDATE_CATEGORY(state, categoryUpdated) {
      state.categories = state.categories.map(category => {
        return category.id == categoryUpdated.id ? categoryUpdated : category;
      });
    },
    UDPATE_ORCID_INFO(state, { categoryId, value }) {
      let category = state.categories.find(cat => cat.id == categoryId);
      if (value) {
        category.orcidStats.known++;
      } else {
        category.orcidStats.unknown++;
      }
      state.categories = state.categories.map(cat => {
        return cat.id == categoryId ? category : cat;
      });
    },
    UDPATE_GROUP_INFO(state, { categoryId, value }) {
      let category = state.categories.find(cat => cat.id == categoryId);
      if (value) {
        category.groupsStats.withGroup++;
      } else {
        category.groupsStats.withoutGroup++;
      }
      state.categories = state.categories.map(cat => {
        return cat.id == categoryId ? category : cat;
      });
    },
    UDPATE_ACTIVE_INFO(state, { categoryId, value }) {
      let category = state.categories.find(cat => cat.id == categoryId);
      if (value) {
        category.activeStats.active++;
      } else {
        category.activeStats.inactive++;
      }
      state.categories = state.categories.map(cat => {
        return cat.id == categoryId ? category : cat;
      });
    },
    UDPATE_YEARS_STATS_INFO(state, { categoryId, year }) {
      let category = state.categories.find(cat => cat.id == categoryId);

      const isExist = category.articleStatsByYear.some(
        stat => stat.year == year
      );

      if (isExist) {
        category.articleStatsByYear = category.articleStatsByYear.map(stat => {
          if (stat.year == year) {
            return Object.assign({}, stat, {
              total: stat.total + 1
            });
          }
          return stat;
        });
      } else {
        category.articleStatsByYear.push({ year, total: 1 });
      }

      state.categories = state.categories.map(cat => {
        return cat.id == categoryId ? category : cat;
      });
    },
    UPDATE_NATIONALITIES(state, { categoryId, country }) {
      let category = state.categories.find(cat => cat.id == categoryId);

      const isNationalityExist = category.nationalities.find(
        nationality => nationality.country == country
      );

      if (isNationalityExist) {
        category.nationalities = category.nationalities.map(nationality => {
          if (nationality.country == country) {
            return Object.assign({}, nationality, {
              total: nationality.total + 1
            });
          }
          return nationality;
        });
      } else {
        category.nationalities.push({ country: country, total: 1 });
      }

      state.categories = state.categories.map(cat => {
        return cat.id == categoryId ? category : cat;
      });
    },
    UPDATE_TOPS(state, { categoryId, criteria, total, groupId, articleId }) {
      let category = state.categories.find(cat => cat.id == categoryId);

      category.tops.push({ criteria, total, groupId, articleId });

      state.categories = state.categories.map(cat => {
        return cat.id == categoryId ? category : cat;
      });
    }
  },
  actions: {
    getArticles({ commit }) {
      FigShareService.getArticles()
        .then(response => {
          commit("SET_ARTICLES", response.data);
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    getCategories({ commit }, filterCategoryParentId) {
      return FigShareService.getCategories()
        .then(async response => {
          const categories = response.data.filter(
            category => category.parent_id == filterCategoryParentId
          );
          categories.map(category => {
            category.nbArticles = null;
            category.isDetailLoaded = false;
            category.nationalities = [];
            category.articleTypes = ArticleUtils.getArticlesTypes();
            category.groupsStats = {};
            category.groupsStats.withGroup = 0;
            category.groupsStats.withoutGroup = 0;
            category.orcidStats = {};
            category.orcidStats.known = 0;
            category.orcidStats.unknown = 0;
            category.activeStats = {};
            category.activeStats.active = 0;
            category.activeStats.inactive = 0;
            category.articleStatsByYear = [];
            category.tops = [];
            return category;
          });
          commit("SET_CATEGORIES", categories);
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    getCategoryDetails({ state, commit, dispatch }, { categoryId, page }) {
      let category = state.categories.filter(cat => cat.id == categoryId)[0];

      if (category.isDetailLoaded) {
        return;
      }
      commit("UPDATE_PROGRESS", true);

      FigShareService.getArticlesByCategory(category.title, page)
        .then(response => {
          const articles = response.data;
          category.nbArticles = category.nbArticles + articles.length;

          if (articles.length == 1000) {
            dispatch("getCategoryDetails", { categoryId, page: page + 1 });
          } else {
            commit("UPDATE_PROGRESS", false);
          }

          for (let article of articles) {
            const articleType = article.defined_type;

            //types
            category.articleTypes = category.articleTypes.map(type => {
              return type.id == articleType
                ? Object.assign({}, type, {
                    nbArticles: type.nbArticles + 1
                  })
                : type;
            });

            //published date by years
            const publishedDate = new Date(
              article.published_date
            ).getFullYear();

            commit("UDPATE_YEARS_STATS_INFO", {
              categoryId,
              year: publishedDate
            });
          }

          category.isDetailLoaded = true;
          commit("UPDATE_CATEGORY", category);

          // Top stats
          dispatch("getArticleStats", {
            categoryId,
            categoryName: category.title,
            criteria: "views"
          });

          dispatch("getArticleStats", {
            categoryId,
            categoryName: category.title,
            criteria: "downloads"
          });

          dispatch("getArticleStats", {
            categoryId,
            categoryName: category.title,
            criteria: "shares"
          });

          // Nationalities
          articles.forEach(article => {
            dispatch("getAuthorsNationalities", {
              article,
              categoryId: category.id
            });
          });
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    getAuthorsNationalities({ commit }, { article, categoryId }) {
      FigShareService.getArticle(article.id)
        .then(response => {
          const detailArticle = response.data;
          const articleGroup = detailArticle.group_id;

          commit("UDPATE_GROUP_INFO", { categoryId, value: articleGroup });

          const isArticlePublishedByOrcid = detailArticle.authors.some(
            author => author.orcid_id
          );

          commit("UDPATE_ORCID_INFO", {
            categoryId,
            value: isArticlePublishedByOrcid
          });

          if (!isArticlePublishedByOrcid) {
            const isArticlePublishedByActive = detailArticle.authors.some(
              author => author.is_active
            );

            commit("UDPATE_ACTIVE_INFO", {
              categoryId,
              value: isArticlePublishedByActive
            });
          }
          detailArticle.authors.forEach(author => {
            if (author.orcid_id) {
              OrcidService.getAuthor(author.orcid_id)
                .then(response => {
                  const country =
                    response.data.person.addresses.address[0].country.value;
                  commit("UPDATE_NATIONALITIES", { categoryId, country });
                })
                .catch(error => {
                  console.log(error.response);
                  commit("UPDATE_NATIONALITIES", {
                    categoryId,
                    country: "ORCID-BLOCKED"
                  });
                });
            } else {
              commit("UPDATE_NATIONALITIES", {
                categoryId,
                country: "UNKNOWN"
              });
            }
          });
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    getArticleStats({ commit }, { categoryId, categoryName, criteria }) {
      FigShareService.getArticleByCategoryOrderByCriteria({
        categoryName,
        criteria
      })
        .then(response => {
          const articleId = response.data[0].id;
          const groupId = response.data[0].group_id;
          FigShareService.getNumberCriteria({ article: articleId, criteria })
            .then(response => {
              console.log("MMMM : " + response.data);
              const total = response.data.totals;
              console.log(total);
              commit("UPDATE_TOPS", {
                categoryId,
                criteria,
                total,
                groupId,
                articleId
              });
            })
            .catch(error => {
              console.log(error.response);
            });
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    getStatsByCategories({ commit, state, dispatch }, filterCategoryParentId) {
      return FigShareService.getCategories()
        .then(async response => {
          const categories = response.data.filter(
            category => category.parent_id == filterCategoryParentId
          );
          categories.map(category => {
            category.nbArticles = null;
            category.nationalities = [];
            category.articleTypes = ArticleUtils.getArticlesTypes();
            return category;
          });
          commit("SET_CATEGORIES", categories);

          for (let category of categories) {
            await FigShareService.getArticlesByCategory(category.title)
              .then(response => {
                const articles = response.data;
                category.nbArticles = articles.length;
                for (let article of articles) {
                  const articleType = article.defined_type;
                  category.articleTypes = category.articleTypes.map(type => {
                    return type.id == articleType
                      ? Object.assign({}, type, {
                          nbArticles: type.nbArticles + 1
                        })
                      : type;
                  });
                }

                commit("UPDATE_CATEGORY", category);
                response.data.forEach(article => {
                  dispatch("getAuthorsNationalities", {
                    article,
                    categoryId: category.id
                  });
                });
              })
              .catch(error => {
                console.log(error.response);
              });
          }

          state.categories.forEach(category => {
            console.log(category.title + "," + category.nbArticles);
          });
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
