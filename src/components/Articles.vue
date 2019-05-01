<template>
  <v-layout row wrap>
    <v-flex xs12>
      <h1>{{ message }}</h1>
    </v-flex>
    <Article v-for="article in articles" :key="article.id" :article="article" />
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import Article from "@/components/Article.vue";

export default {
  components: { Article },
  data() {
    return {
      message: "Hello world"
    };
  },
  computed: {
    ...mapState({ articles: state => state.ArticlesModule.articles })
  },
  mounted() {
    this.$store.dispatch("getArticles");
  }
};
</script>

<style>
.flex {
  margin-bottom: 10px;
}
</style>
