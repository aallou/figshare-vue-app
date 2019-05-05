import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.figshare.com/v2"
});

const apiFigShareStats = axios.create({
  baseURL: "https://stats.figshare.com/"
});

export default {
  getArticles() {
    return apiClient.get("/articles");
  },
  getArticlesByCategory(categoryName, page) {
    return apiClient.post("/articles/search", {
      search_for: ":category: '" + categoryName + "'",
      published_since: "2015-01-01",
      page,
      page_size: 1000
    });
  },
  getArticle(id) {
    return apiClient.get("/articles/" + id);
  },
  getCategories() {
    return apiClient.get("/categories");
  },
  getArticleByCategoryOrderByCriteria({ categoryName, criteria }) {
    return apiClient.post("/articles/search", {
      search_for: ":category: '" + categoryName + "'",
      published_since: "2015-01-01",
      limit: 1,
      order: criteria
    });
  },
  getNumberCriteria({ article, criteria }) {
    return apiFigShareStats.get(`/total/${criteria}/article/${article}`);
  }
};
