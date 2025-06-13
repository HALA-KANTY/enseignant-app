<template>
  <div id="app">
    <nav class="navbar" v-if="showNavbar">
      <div class="nav-container">
        <div class="nav-links">
        
          
          <router-link to="/ajout" class="nav-link">
            <div class="icon-wrapper">
              <img class="icon-default" src="../src/icone/add_user.png" alt="Ajout">
              <img class="icon-hover" src="../src/icone/add_user.png" alt="Ajout">
            </div>
            <span>Ajout</span>
          </router-link>
          
          <router-link to="/liste" class="nav-link">
            <div class="icon-wrapper">
              <img class="icon-default"  src="../src/icone/shortlist.png" alt="Liste">
              <img class="icon-hover" src="../src/icone/shortlist.png" alt="Liste">
            </div>
            <span>Liste</span>
          </router-link>
            <router-link to="/bilan" class="nav-link">
            <div class="icon-wrapper">
              <img class="icon-default" src="../src/icone/grahp.png" alt="Bilan">
              <img class="icon-hover" src="../src/icone/grahp.png" alt="Bilan">
            </div>
            <span>Bilan</span>
          </router-link>
        </div>

        <button @click="logout" class="logout-btn">
          <img src="../src/icone/logout_96px.png" alt="Déconnexion">
          <span>Déconnexion</span>
        </button>
      </div>
    </nav>

    <router-view/>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  setup() {
    const route = useRoute()

    const showNavbar = computed(() => !['/login', '/register'].includes(route.path))

    function logout() {
       if (confirm("Voulez-vous vraiment vous deconnecter ?")) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }
    return { showNavbar, logout }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.navbar {
  width: 100%;
  padding: 0.5rem 0;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #2E424D;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: bolder;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #5B8291;
  background-color: rgba(91, 130, 145, 0.1);
}

.router-link-exact-active {
  color: #5B8291 !important;
  font-weight: 600;
  background-color: rgba(91, 130, 145, 0.08);
}

.icon-wrapper {
  position: relative;
  width: 24px;
  height: 24px;
}

.navbar img {
  width: 24px;
  height: 24px;
  transition: opacity 0.3s ease;
}

.icon-default {
  opacity: 0.7;
}

.icon-hover {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}

.router-link-exact-active .icon-default {
  opacity: 0;
}

.router-link-exact-active .icon-hover {
  opacity: 1;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #e60000;
  transform: translateY(-1px);
}

.logout-btn img {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

#app {
  padding-top: 60px; /* Pour compenser la navbar fixe */
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nav-links {
    width: 100%;
    justify-content: space-around;
    gap: 0;
  }
  
  .nav-link {
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.9rem;
    padding: 0.5rem;
  }
  
  .logout-btn {
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }
  
  #app {
    padding-top: 100px;
  }
}
</style>