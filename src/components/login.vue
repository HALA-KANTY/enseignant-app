<template>
  <div class="auth-container">
    <div class="forms-container">
      <!-- Formulaire de connexion -->
      <div class="signin-form" :class="{ 'active': isLogin }">
        <h2>Se connecter</h2>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <input 
              type="text" 
              v-model="identifiant" 
              @blur="validateField('identifiant')"
              placeholder="Email ou Nom" 
              required
              :class="{ 'error': errors.identifiant && touched.identifiant }"
            >
            <span class="error-message" v-if="errors.identifiant && touched.identifiant">
              {{ errors.identifiant }}
            </span>
          </div>
          <div class="input-group password-group">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              @blur="validateField('password')"
              placeholder="Mot de passe" 
              required
              :class="{ 'error': errors.password && touched.password }"
            >
            <span class="toggle-password" @click="toggleShowPassword">
              <img 
                :src="showPassword ? require('@/icone/yeux_fermer.png') : require('@/icone/yeux_ouvert.png')" 
                alt="Toggle password visibility"
              >
            </span>
            <span class="error-message" v-if="errors.password && touched.password">
              {{ errors.password }}
            </span>
          </div>
         
          <button type="submit" class="auth-btn" :disabled="isLoading">
            {{ isLoading ? 'Connexion...' : 'SE CONNECTER' }}
          </button>
        </form>
      </div>

      <!-- Formulaire d'inscription -->
      <div class="signup-form" :class="{ 'active': !isLogin }">
        <h2>Créer un compte</h2>
        <form @submit.prevent="handleRegister">
          <div class="input-group">
            <input 
              type="text" 
              v-model="registerData.name" 
              @blur="validateField('name')"
              placeholder="Nom complet" 
              required
              :class="{ 'error': errors.name && touched.name }"
            >
            <span class="error-message" v-if="errors.name && touched.name">
              {{ errors.name }}
            </span>
          </div>
          <div class="input-group">
            <input 
              type="email" 
              v-model="registerData.email" 
              @blur="validateField('email')"
              placeholder="Email" 
              required
              :class="{ 'error': errors.email && touched.email }"
            >
            <span class="error-message" v-if="errors.email && touched.email">
              {{ errors.email }}
            </span>
          </div>
          <div class="input-group password-group">
            <input 
              :type="showRegisterPassword ? 'text' : 'password'" 
              v-model="registerData.password" 
              @blur="validateField('password')"
              placeholder="Mot de passe" 
              required
              :class="{ 'error': errors.password && touched.password }"
            >
            <span class="toggle-password" @click="toggleShowRegisterPassword">
              <img 
                :src="showRegisterPassword ? require('../icone/yeux_fermer.png') : require('../icone/yeux_ouvert.png')" 
                alt="Toggle password visibility"
              >
            </span>
            <span class="error-message" v-if="errors.password && touched.password">
              {{ errors.password }}
            </span>
          </div>
          <div class="input-group password-group">
            <input 
              :type="showRegisterConfirmPassword ? 'text' : 'password'" 
              v-model="registerData.confirmPassword" 
              @blur="validateField('confirmPassword')"
              placeholder="Confirmer mot de passe" 
              required
              :class="{ 'error': errors.confirmPassword && touched.confirmPassword }"
            >
            <span class="toggle-password" @click="toggleShowRegisterConfirmPassword">
              <img 
                :src="showRegisterConfirmPassword ? require('@/icone/yeux_fermer.png') : require('@/icone/yeux_ouvert.png')" 
                alt="Toggle password visibility"
              >
            </span>
            <span class="error-message" v-if="errors.confirmPassword && touched.confirmPassword">
              {{ errors.confirmPassword }}
            </span>
          </div>
          <button 
            type="submit" 
            class="auth-btn" 
            :disabled="isLoading || !isRegisterFormValid"
          >
            {{ isLoading ? 'Inscription...' : "S'INSCRIRE" }}
          </button>
        </form>
      </div>
    </div>

    <div class="welcome-container">
      <div class="welcome-panel" :class="{ 'active': isLogin }">
        <h2>Bonjour, Ami !</h2>
        <p>Entrez vos informations personnelles et commencez votre voyage avec nous</p>
        <button class="toggle-btn" @click="toggleForm">S'INSCRIRE</button>
      </div>
      
      <div class="welcome-panel" :class="{ 'active': !isLogin }">
        <h2>Content de vous revoir !</h2>
        <p>Pour rester connecté avec nous, connectez-vous avec vos informations personnelles</p>
        <button class="toggle-btn" @click="toggleForm">SE CONNECTER</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'

export default {
  name: 'Login',
  data() {
    return {
      isLogin: true,
      form: {
        identifiant: '',
        password: '',
        name: '',
        email: '',
        confirmPassword: ''
      },
      isLoading: false,
      showPassword: false,
      showRegisterPassword: false,
      showRegisterConfirmPassword: false,
      touched: {
        identifiant: false,
        password: false,
        name: false,
        email: false,
        confirmPassword: false
      },
      errors: {
        identifiant: '',
        password: '',
        name: '',
        email: '',
        confirmPassword: ''
      }
    }
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  computed: {
    isRegisterFormValid() {
      return (
        this.form.name &&
        this.form.email &&
        this.form.password &&
        this.form.confirmPassword &&
        !this.errors.name &&
        !this.errors.email &&
        !this.errors.password &&
        !this.errors.confirmPassword &&
        this.form.password === this.form.confirmPassword
      )
    }
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin
      this.clearForm()
    },
    
    clearForm() {
      this.form = {
        identifiant: '',
        password: '',
        name: '',
        email: '',
        confirmPassword: ''
      }
      this.clearErrors()
      this.clearTouched()
    },
    
    clearErrors() {
      this.errors = {
        identifiant: '',
        password: '',
        name: '',
        email: '',
        confirmPassword: ''
      }
    },
    
    clearTouched() {
      this.touched = {
        identifiant: false,
        password: false,
        name: false,
        email: false,
        confirmPassword: false
      }
    },
    
    togglePassword(field) {
      this[`show${field}`] = !this[`show${field}`]
    },
    
    validateField(field) {
      this.touched[field] = true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      switch(field) {
        case 'identifiant':
          this.errors.identifiant = !this.form.identifiant ? 'Veuillez entrer un identifiant' : ''
          break
          
        case 'password':
          if (this.isLogin) {
            this.errors.password = !this.form.password ? 'Veuillez entrer un mot de passe' : ''
          } else {
            if (!this.form.password) {
              this.errors.password = 'Veuillez entrer un mot de passe'
            } else if (this.form.password.length < 4) {
              this.errors.password = 'Le mot de passe doit contenir au moins 4 caractères'
            } else {
              this.errors.password = ''
            }
          }
          break
          
        case 'name':
          if (!this.form.name) {
            this.errors.name = 'Veuillez entrer votre nom complet'
          } else if (this.form.name.length < 3) {
            this.errors.name = 'Le nom doit contenir au moins 3 caractères'
          } else {
            this.errors.name = ''
          }
          break
          
        case 'email':
          if (!this.form.email) {
            this.errors.email = 'Veuillez entrer un email'
          } else if (!emailRegex.test(this.form.email)) {
            this.errors.email = 'Veuillez entrer un email valide'
          } else {
            this.errors.email = ''
          }
          break
          
        case 'confirmPassword':
          if (!this.form.confirmPassword) {
            this.errors.confirmPassword = 'Veuillez confirmer votre mot de passe'
          } else if (this.form.password !== this.form.confirmPassword) {
            this.errors.confirmPassword = 'Les mots de passe ne correspondent pas'
          } else {
            this.errors.confirmPassword = ''
          }
          break
      }
    },
    
    async handleLogin() {
      this.validateField('identifiant')
      this.validateField('password')
      
      if (this.errors.identifiant || this.errors.password) {
        this.toast.error('Veuillez corriger les erreurs dans le formulaire')
        return
      }

      this.isLoading = true
      try {
        const response = await fetch('https://steeven.wuaze.com/api/enseignants.php?action=login', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            identifiant: this.form.identifiant,
            mdp: this.form.password
          })
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || "Identifiants incorrects")
        }

        // Stockage des données utilisateur
        localStorage.setItem('authToken', 'true') // À remplacer par un vrai token si disponible
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('user_id', data.user.id)
        
        this.toast.success('Connexion réussie 🎉')
        this.$router.push('/bilan')
      } catch (error) {
        this.toast.error(error.message || 'Erreur lors de la connexion')
        this.form.password = ''
      } finally {
        this.isLoading = false
      }
    },
    
    async handleRegister() {
      ['name', 'email', 'password', 'confirmPassword'].forEach(f => this.validateField(f))
      
      if (!this.isRegisterFormValid) {
        this.toast.error('Veuillez corriger les erreurs dans le formulaire')
        return
      }

      this.isLoading = true
      try {
        const response = await fetch('https://steeven.wuaze.com/api/enseignants.php?action=register', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: this.form.name,
            email: this.form.email,
            password: this.form.password
          })
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || "Erreur lors de l'inscription")
        }

        this.toast.success('Inscription réussie 🎉 Vous pouvez maintenant vous connecter.')
        this.toggleForm()
      } catch (error) {
        this.toast.error(error.message || "Erreur lors de la création du compte")
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>


<style scoped>
/* Styles de base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

.auth-container {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
  margin-top: -120px;
}

.forms-container {
 
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  transition: all 0.5s ease;
}

.welcome-container {
  flex: 1;
  background: linear-gradient(135deg, #2E424D, #5B8291);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* Styles des formulaires */
.signin-form,
.signup-form {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: none;
}

.signin-form.active,
.signup-form.active {
  display: block;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

h2 {
  margin-bottom: 1.5rem;
  color: #2E424D;
  text-align: center;
}

.input-group {
  margin-bottom: 1.5rem;
  position: relative;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #2E424D;
  outline: none;
  box-shadow: 0 0 0 2px rgba(46, 66, 77, 0.2);
}

.forgot-password {
  display: block;
  text-align: right;
  margin-bottom: 1.5rem;
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  color: #2E424D;
  text-decoration: underline;
}

.auth-btn {
  width: 70%;
  padding: 15px;
  background:white ;
  color: #2E424D;
  border: 2px solid #2E424D;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 15%;
}

.auth-btn:hover {
  background:#2E424D ;
  color:white ;
  border: 2px solid #2E424D;
}

.auth-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

/* Styles du panneau d'accueil */
.welcome-panel {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  display: none;
  animation: fadeIn 0.5s ease;
}

.welcome-panel.active {
  display: block;
}

.welcome-panel h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.welcome-panel p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.toggle-btn {
  padding: 10px 30px;
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: white;
  color: #2E424D;
}

/* Responsive */
@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    margin-top: -200px;
  }
  
  .welcome-container {
    padding: 2rem 1rem;
    order: -1;
  }
  
  .forms-container {
    padding: 1rem;
  }
  
  .signin-form,
  .signup-form {
    padding: 1.5rem;
  }
}

.error {
  border-color: #e74c3c !important;
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}

.password-group {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.toggle-password img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}


</style>
