import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: "Home",
      component: () => import('@/Vues/HomeView.vue'),
      meta: {title: "Accueil | CampXplore"},
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
      path: "/login",
      name: "login",
      component: () => import('@/Vues/LoginView.vue'),
      meta: {title: "Se connecter"},
    },
    {
      path: "/register",
      name: "register",
      component: () => import('@/Vues/RegisterView.vue'),
      meta: {title: "S'inscrire"},
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import('@/Vues/ProfileView.vue'),
      meta: {title: "Profile | CampXplore", requireAuth: true},
    },
    {
      path: "/reservations",
      name: "reservations",
      component: () => import('@/Vues/ReservationsView.vue'),
      meta: {title: "Réservations | CampXplore", requireAuth: true},
    },
    {
      path: "/reservations/:id",
      name: "ReservationDetails",
      component: () => import('@/Vues/ReservationDetailView.vue'),
      props: true,
      meta: {title: "Détails de la réservation | CampXplore", requireAuth: true},
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/Vues/NotFoundView.vue'),
      meta: {title: "Page introuvable"},
    }
  ],
  scrollBehavior(to, from, savedPosition){
    return new Promise((resolve) => {
      setTimeout(() => {
        if(savedPosition){
          resolve(savedPosition);
        }
        else{
          resolve({left: 0, top: 0});
        }
      }, 500);
    })
  }
})

router.beforeEach((to, from, next) => {
  const isLogged = localStorage.getItem('jwt');
  if (to.meta.requireAuth && !isLogged){
    next({name: "login", query: {redirect: to.fullPath}});
  }
  next();
});

router.afterEach((to, from, next) => {
  if (to.meta?.title){
    document.title = to.meta.title;
  }
});

export default router
