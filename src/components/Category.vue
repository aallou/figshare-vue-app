<template>
  <v-flex xs12 sm6>
    <v-card>
      <v-card-title>
        <h4>{{ category.title }}</h4>
        &nbsp;
        <span v-if="category.nbArticles" class="grey--text"
          >&nbsp;({{ category.nbArticles }})</span
        >
      </v-card-title>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-tile v-for="type in category.articleTypes" :key="type.id">
          <v-list-tile-content>{{ type.label }}:</v-list-tile-content>
          <v-list-tile-content class="align-end">
            {{ type.nbArticles }}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-card-title>
        <h4>Nationalities</h4>
      </v-card-title>
      <v-list dense>
        <v-list-tile
          v-for="nationality in category.nationalities"
          :key="nationality.country"
        >
          <v-list-tile-content>{{ nationality.country }}:</v-list-tile-content>
          <v-list-tile-content class="align-end">
            {{ nationality.total }}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  props: {
    category: Object
  }
};
</script>

<style></style>
