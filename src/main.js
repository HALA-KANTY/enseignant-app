import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Configuration Axios
axios.defaults.baseURL = 'http://localhost/enseignant-api';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Création de l'application
const app = createApp(App)

// Utilisation du routeur et du plugin Toastification
app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  showCloseButtonOnHover: false,
})

// Montage de l'application
app.mount('#app')
