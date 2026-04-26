import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: "Home",
      redirect: "/campsites",
      meta: {title: "Accueil"},
    },
    {
      path: "/campsites",
      name: "Campsites",
      component: ()  => import('@/Vues/CampsitesView.vue'),
      meta: {title: "Campsites"},
    },
    {
      path: "/campsites/available",
      name: "CampsitesAvailable",
      component: ()  => import('@/Vues/CampsitesView.vue'),
      meta: {title: "Campsites Disponibles"}
    },
    {
      path: "/campsites/:id",
      name: "CampsitesDetails",
      component: () => import('@/Vues/CampsitesDetailsView.vue'),
      props: true,
      meta: {title: "Détails d'un campsite"},
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/Vues/NotFoundView.vue'),
      meta: {title: "Page introuvable"},
    }
  ],
})

router.afterEach((to, from, next) => {
  if (to.meta?.title){
    document.title = to.meta.title;
  }
});

export default router
