<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-data-iterator
        :items="categories"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        content-tag="v-layout"
        row
        wrap
      >
        <template v-slot:header>
          <v-toolbar class="mb-2" color="indigo darken-5" dark flat>
            <v-toolbar-title>Categories</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item="props">
          <v-flex xs12 sm6>
            <v-card>
              <v-card-title>
                <h4>{{ props.item.title }}</h4>&nbsp;
              </v-card-title>
              <v-divider></v-divider>
              <v-card-actions>
                <router-link :to="{ name: 'category', params: { id: props.item.id } }">
                  <v-btn flat color="orange">Details</v-btn>
                </router-link>
              </v-card-actions>
            </v-card>
          </v-flex>
        </template>
      </v-data-iterator>
    </v-flex>
    <v-flex xs12>
      <router-view :key="$route.fullPath"></router-view>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      rowsPerPageItems: [4, 8, 12],
      pagination: {
        rowsPerPage: 4
      }
    };
  },
  computed: {
    ...mapState({
      categories: state => state.ArticlesModule.categories
    }),
    globalStats() {
      let nationalitiesStats = [];
      this.categories.forEach(category => {
        category.nationalities.forEach(nationality => {
          const isNationalityExist = nationalitiesStats.find(
            nat => nat.country == nationality.country
          );

          if (isNationalityExist) {
            nationalitiesStats = nationalitiesStats.map(nat => {
              if (nat.country == nationality.country) {
                return Object.assign({}, nationality, {
                  total: nationality.total + nat.total
                });
              }
              return nat;
            });
          } else {
            nationalitiesStats.push(nationality);
          }
        });
      });
      return nationalitiesStats;
    }
  },
  mounted() {
    this.$store.dispatch("getCategories", 50);
  }
};
</script>

<style>
.flex {
  padding: 10px;
}
a {
  text-decoration: none;
}
</style>
