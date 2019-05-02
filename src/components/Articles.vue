<template>
  <v-layout row wrap>
    <v-flex xs12>
      <h1>The number of categories is {{ categories.length }}</h1>
    </v-flex>
    <Category v-for="category in categories" :key="category.id" :category="category"/>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import Category from "@/components/Category.vue";

export default {
  components: { Category },
  data() {
    return {
      message: "Hello world"
    };
  },
  computed: {
    ...mapState({ categories: state => state.ArticlesModule.categories })
  },
  mounted() {
    this.$store.dispatch("getStatsByCategories", 50);
  }
};
</script>

<style>
.flex {
  padding: 10px;
}
</style>
