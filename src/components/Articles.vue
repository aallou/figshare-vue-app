<template>
  <div>
    <h1>{{ message }}</h1>
    <div v-for="article in articles" :key="article.id">
      <h3>{{ article.title }}</h3>
    </div>
  </div>
</template>

<script>
import FigShareService from "@/services/FigShareService";

export default {
  data() {
    return {
      message: "Hello word",
      articles: []
    };
  },
  mounted() {
    FigShareService.getArticles()
      .then(response => {
        this.articles = response.data;
      })
      .catch(error => console.log(error));
  }
};
</script>

<style></style>
