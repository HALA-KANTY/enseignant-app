import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/login.vue'),
    meta: { requiresAuth: false, hideNavbar: true }
  },
  {
    path: '/ajout',
    name: 'ajout',
    component: () => import('../components/AjoutEnseignant.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/liste',
    name: 'liste',
    component: () => import('../components/ListeEnseignants.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bilan',
    name: 'bilan',
    component: () => import('../components/BilanEnseignants.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/', // Redirection par défaut
    redirect: '/bilan'
  },
  {
    path: '/:pathMatch(.*)*', // Capture toutes les routes non définies
    redirect: '/liste'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Garde de navigation globale
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken')
  
  // Si la route nécessite une authentification et que l'utilisateur n'est pas connecté
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } 
  // Si l'utilisateur est déjà connecté mais essaie d'accéder à la page de login
  else if (to.name === 'login' && isAuthenticated) {
    next('/') // ou next('/liste') selon votre préférence
  } 
  // Dans tous les autres cas, autoriser l'accès
  else {
    next()
  }
})

export default router