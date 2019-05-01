import FigShareService from "@/services/FigShareService.js";

export default {
  state: {
    articles: []
  },
  mutations: {
    SET_ARTICLES(state, articles) {
      state.articles = articles;
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
    }
  }
};
