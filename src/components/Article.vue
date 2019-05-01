<template>
  <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">{{ article.defined_type_name }}</h3>
          <div>{{ article.title }}</div>
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
    article: Object
  }
};
</script>

<style></style>
