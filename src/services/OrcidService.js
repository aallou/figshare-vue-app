import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://pub.orcid.org/v2.0/",
  headers: { Accept: "application/json" }
});

export default {
  getAuthor(orcid) {
    return apiClient.get(orcid);
  }
};
