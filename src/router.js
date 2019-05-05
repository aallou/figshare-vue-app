import Vue from "vue";
import Router from "vue-router";
import Categories from "./components/Categories.vue";
import Category from "./components/Category.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/", redirect: "/categories" },
    {
      path: "/categories",
      name: "categories",
      component: Categories,
      children: [
        {
          path: ":id",
          component: Category,
          name: "category"
        }
      ]
    }
  ]
});
