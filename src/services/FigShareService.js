import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.figshare.com/v2"
});

export default {
  getArticles() {
    return apiClient.get("/articles");
  },
  getArticlesByCategory(categoryName) {
    return apiClient.post("/articles/search", {
      search_for: ":category: '" + categoryName + "'",
      published_since: "2015-05-01",
      limit: 1000
    });
  },
  getArticle(id) {
    return apiClient.get("/articles/" + id);
  },
  getCategories() {
    return apiClient.get("/categories");
  }
};
