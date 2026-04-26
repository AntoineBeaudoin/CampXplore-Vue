import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: "Home",
      redirect: "/campsites"
    },
    {
      path: "/campsites",
      name: "Campsites",
      component: ()  => import('@/Vues/CampsitesView.vue')
    },
    {
      path: "/campsites/available",
      name: "CampsitesAvailable",
      component: ()  => import('@/Vues/CampsitesView.vue')
    },
    {
      path: "/campsites/:id",
      name: "CampsitesDetails",
      component: () => import('@/Vues/CampsitesDetailsView.vue'),
      props: true
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/Vues/NotFoundView.vue'),
      meta: {title: "Page introuvable"}
    }
  ],
})

export default router
