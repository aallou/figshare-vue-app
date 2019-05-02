import FigShareService from "@/services/FigShareService.js";

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
        if (category.id == categoryUpdated.id) {
          return categoryUpdated;
        } else {
          return category;
        }
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
    getStatsByCategories({ commit, state }, filterCategoryParentId) {
      return FigShareService.getCategories()
        .then(async response => {
          const categories = response.data.filter(
            category => category.parent_id == filterCategoryParentId
          );
          categories.map(category => (category.nbArticles = null));
          commit("SET_CATEGORIES", categories);

          for (let category of categories) {
            await FigShareService.getArticlesByCategory(category.title)
              .then(response => {
                category.nbArticles = response.data.length;
                commit("UPDATE_CATEGORY", category);
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
