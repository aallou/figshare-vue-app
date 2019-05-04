import FigShareService from "@/services/FigShareService.js";
import OrcidService from "@/services/OrcidService.js";
import ArticleUtils from "@/utils/ArticleUtils.js";

export default {
  state: {
    articles: [],
    categories: []
  },
  mutations: {
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
            i++;
          }

          state.categories.forEach(category => {
            console.log(category.title + "," + category.nbArticles);
          });
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    getAuthorsNationalities({ commit }, { article, categoryId }) {
      FigShareService.getArticle(article.id)
        .then(response => {
          response.data.authors.forEach(author => {
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
    }
  }
};
