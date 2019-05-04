<template>
  <v-flex xs12>
    <v-card>
      <v-card-title>
        <h4>Global stats - Nationalities</h4>
      </v-card-title>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-tile
          v-for="nationality in globalStats"
          :key="nationality.country"
        >
          <v-list-tile-content>{{ nationality.country }}:</v-list-tile-content>
          <v-list-tile-content class="align-end">
            {{ nationality.total }}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
    </v-card>
  </v-flex>
</template>

<script>
import { mapState } from "vuex";

export default {
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
  }
};
</script>

<style></style>
