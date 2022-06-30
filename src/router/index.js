import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/userStore.js";
import DashHome from "@/views/DashHome.vue";
import Sidebar from "@/components/Sidebar.vue";
const siteName = "Neg Auto Services";
const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
    alias: "/login",
    meta: {
      title: siteName + " - Login",
    },
  },
  {
    path: "/d",
    alias: "/dashboard",
    components: {
      default: DashHome,
      sidebar: Sidebar,
    },
    meta: {
      title: siteName,
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          title: siteName + " - Dashboard",
        },
      },
      {
        path: "reservations",
        name: "reservation",
        component: () => import("@/views/Reservation.vue"),
        meta: {
          title: siteName + " - Reservations",
        },
      },
      {
        path: "chat/:id?",
        name: "chat",
        component: () => import("@/views/Chat.vue"),
        props: true,
        meta: {
          title: siteName + " - Chat",
        },
      },
      {
        path: "cars",
        name: "car.index",
        component: () => import("@/views/car/CarIndex.vue"),
        meta: {
          title: siteName + " - Cars",
        },
      },
      {
        path: "car/create",
        name: "car.create",
        component: () => import("@/views/car/CarCreate.vue"),
        meta: {
          title: siteName + " - Create Car",
        },
      },
      {
        path: "car/:id/edit",
        name: "car.edit",
        props: true,
        component: () => import("@/views/car/CarEdit.vue"),
        meta: {
          title: siteName + " - Edit Car",
        },
      },
      {
        path: "brands",
        name: "brand.index",
        component: () => import("@/views/brand/BrandIndex.vue"),
        meta: {
          title: siteName + " - Brands",
        },
      },
      {
        path: "brand/create",
        name: "brand.create",
        component: () => import("@/views/brand/BrandCreate.vue"),
        meta: {
          title: siteName + " - Create Brand",
        },
      },
      {
        path: "brand/:id/edit",
        name: "brand.edit",
        props: true,
        component: () => import("@/views/brand/BrandEdit.vue"),
        meta: {
          title: siteName + " - Edit Brand",
        },
      },
      {
        path: "categories",
        name: "category.index",
        component: () => import("@/views/category/CategoryIndex.vue"),
        meta: {
          title: siteName + " - Categories",
        },
      },
      {
        path: "category/create",
        name: "category.create",
        component: () => import("@/views/category/CategoryCreate.vue"),
        meta: {
          title: siteName + " - Create Category",
        },
      },
      {
        path: "category/:id/edit",
        name: "category.edit",
        props: true,
        component: () => import("@/views/category/CategoryEdit.vue"),
        meta: {
          title: siteName + " - Edit Category",
        },
      },
      {
        path: "faqs",
        name: "faq.index",
        component: () => import("@/views/faq/FaqIndex.vue"),
        meta: {
          title: siteName + " - Faqs",
        },
      },
      {
        path: "faq/create",
        name: "faq.create",
        component: () => import("@/views/faq/FaqCreate.vue"),
        meta: {
          title: siteName + " - Create Faq",
        },
      },
      {
        path: "faq/:id/edit",
        name: "faq.edit",
        props: true,
        component: () => import("@/views/faq/FaqEdit.vue"),
        meta: {
          title: siteName + " - Edit Faq",
        },
      },
      {
        path: "users",
        name: "user.index",
        component: () => import("@/views/user/UserIndex.vue"),
        meta: {
          title: siteName + " - Users",
        },
      },
      {
        path: "user/create",
        name: "user.create",
        component: () => import("@/views/user/UserCreate.vue"),
        meta: {
          title: siteName + " - Create User",
        },
      },
      {
        path: "user/:id/edit",
        name: "user.edit",
        props: true,
        component: () => import("@/views/user/UserEdit.vue"),
        meta: {
          title: siteName + " - Edit User",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)",
    name: "not.found",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      title: siteName + " - Page Introuvable",
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
