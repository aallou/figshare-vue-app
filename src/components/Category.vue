<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-progress-linear
        v-show="progress"
        :indeterminate="progress"
        color="blue"
      ></v-progress-linear>
    </v-flex>
    <v-flex xs12>
      <template>
        <v-toolbar class="mb-2" color="indigo darken-5" dark flat>
          <v-toolbar-title>
            Category Details
            <span class="grey--text">&nbsp;({{ category.title }})</span>
          </v-toolbar-title>
        </v-toolbar>
      </template>
    </v-flex>
    <v-flex xs4>
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
            <v-list-tile-content class="align-end">{{
              type.nbArticles
            }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <v-flex xs4>
      <v-card>
        <v-card-title>
          <h4>Nationalities</h4>
        </v-card-title>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-tile
            v-for="nationality in category.nationalities"
            :key="nationality.country"
          >
            <v-list-tile-content
              >{{ nationality.country }}:</v-list-tile-content
            >
            <v-list-tile-content class="align-end">{{
              nationality.total
            }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <v-flex xs4>
      <v-card>
        <v-card-title>
          <h4>Stats by group</h4>
        </v-card-title>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-tile>
            <v-list-tile-content>With groups:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{
              category.groupsStats.withGroup
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Without groups:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{
              category.groupsStats.withoutGroup
            }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-card-title>
          <h4>Stats at least one orcid known</h4>
        </v-card-title>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-tile>
            <v-list-tile-content>Orcid article known:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{
              category.orcidStats.known
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Orcid article unknown:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{
              category.orcidStats.unknown
            }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-card-title>
          <h4>Stats articles without orcid and actives</h4>
        </v-card-title>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-tile>
            <v-list-tile-content>Active:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{
              category.activeStats.active
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Inactive:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{
              category.activeStats.inactive
            }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      id: this.$route.params.id
    };
  },
  computed: {
    ...mapState({
      categories: state => state.ArticlesModule.categories,
      progress: state => state.ArticlesModule.progress
    }),
    category() {
      return this.categories.filter(cat => cat.id == this.id)[0];
    }
  },
  mounted() {
    this.$store.dispatch("getCategoryDetails", {
      categoryId: this.$route.params.id,
      page: 1
    });
  }
};
</script>

<style></style>
