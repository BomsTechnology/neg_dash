import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";
import Dashboard from "@/views/Dashboard.vue";
import Sidebar from "@/components/Sidebar.vue";
const siteName = "Neg Auto Services";
const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: {
      title: siteName + " - Login",
    },
  },
  {
    path: "/d",
    name: "dashboard",
    components: {
      default: Dashboard,
      sidebar: Sidebar,
    },
    meta: {
      title: siteName + " - Dashboard",
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth) {
    if (await userStore.getCurrentUser()) {
      next();
    } else {
      next({ name: "login" });
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title;
});

export default router;
