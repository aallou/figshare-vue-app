<template>
  <v-flex xs12 sm4>
    <v-card>
      <v-card-title primary-title>
        <div>
          <div class="headline">{{ category.title }}</div>
          <span class="grey--text" v-show="category.nbArticles"
            >Number of articles : {{ category.nbArticles }}</span
          >
        </div>
      </v-card-title>

      <v-card-actions>
        <v-btn flat color="orange">Details</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  props: {
    category: Object
  },
  watch: {
    category() {
      console.log("change " + this.category);
    }
  }
};
</script>

<style></style>
