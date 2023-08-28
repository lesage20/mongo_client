const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "home",
      },
      {
        path: "/:db",
        component: () => import("pages/CollectionsList.vue"),
        name: "collections",
      },
      {
        path: "/:db/:name",
        component: () => import("pages/CollectionDetail.vue"),
        name: "collection",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
