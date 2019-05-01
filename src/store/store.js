import Vue from "vue";
import Vuex from "vuex";
import ArticlesModule from "@/store/modules/articles.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ArticlesModule
  }
});
