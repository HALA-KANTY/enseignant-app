<template>
  <main class="bdy">
    <div class="ajout">
      <h2>Ajouter un enseignant</h2> 
      <form @submit.prevent="ajouterEnseignant">
        <div class="input-group">
          <div class="icon-container">
            <img src="../icone/binary_file_96px.png" alt="Matricule">
          </div>
          <div class="input-wrapper">
            <input 
              v-model.trim="form.matricule" 
              id="matricule" 
              placeholder=" " 
              required
              @blur="validateField('matricule')"
            />
            <label for="matricule">Matricule</label>
            <span class="error-message" v-if="errors.matricule">{{ errors.matricule }}</span>
          </div>
        </div>
        
        <div class="input-group">
          <div class="icon-container">
            <img src="../icone/nom.png" alt="Nom">
          </div>
          <div class="input-wrapper">
            <input 
              v-model.trim="form.nom" 
              id="nom" 
              placeholder=" " 
              required
              @blur="validateField('nom')"
            />
            <label for="nom">Nom et Prénom</label>
            <span class="error-message" v-if="errors.nom">{{ errors.nom }}</span>
          </div>
        </div>
        
        <div class="input-group">
          <div class="icon-container">
            <img src="../icone/paper_money_96px.png" alt="Taux horaire">
          </div>
          <div class="input-wrapper">
            <input 
              v-model.number="form.taux_horaire" 
              id="taux" 
              placeholder=" " 
              type="number" 
              step="0.01" 
              min="0" 
              required
              @blur="validateField('taux_horaire')"
            />
            <label for="taux">Taux horaire</label>
            <span class="error-message" v-if="errors.taux_horaire">{{ errors.taux_horaire }}</span>
          </div>
        </div>
        
        <div class="input-group">
          <div class="icon-container">
            <img src="../icone/teacher_96px.png" alt="Heures">
          </div>
          <div class="input-wrapper">
            <input 
              v-model.number="form.nombre_heures" 
              id="heures" 
              placeholder=" " 
              type="number" 
              min="0" 
              required
              @blur="validateField('nombre_heures')"
            />
            <label for="heures">Nombre d'heures</label>
            <span class="error-message" v-if="errors.nombre_heures">{{ errors.nombre_heures }}</span>
          </div>
        </div>
        
        <div class="btn-container">
          <button type="submit" :disabled="loading || hasErrors">
            {{ loading ? 'Envoi en cours...' : 'Ajouter' }}
          </button>
          <button type="reset" @click="resetForm">Annuler</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import { useToast } from 'vue-toastification'

export default {
  name: 'AjoutEnseignant',
  data() {
    return {
      form: {
        matricule: '',
        nom: '',
        taux_horaire: '',
        nombre_heures: ''
      },
      errors: {
        matricule: '',
        nom: '',
        taux_horaire: '',
        nombre_heures: ''
      },
      loading: false
    }
  },
  computed: {
    hasErrors() {
      return Object.values(this.errors).some(error => error !== '') || 
             Object.values(this.form).some(field => field === '')
    }
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  methods: {
    validateField(field) {
      switch(field) {
        case 'matricule':
          this.errors.matricule = this.form.matricule ? '' : 'Le matricule est requis'
          break
        case 'nom':
          this.errors.nom = this.form.nom ? '' : 'Le nom est requis'
          if (this.form.nom && this.form.nom.length < 3) {
            this.errors.nom = 'Le nom doit contenir au moins 3 caractères'
          }
          break
        case 'taux_horaire':
          this.errors.taux_horaire = this.form.taux_horaire >= 0 ? '' : 'Le taux horaire doit être positif'
          break
        case 'nombre_heures':
          this.errors.nombre_heures = this.form.nombre_heures >= 0 ? '' : 'Le nombre d\'heures doit être positif'
          break
      }
    },
    resetForm() {
      this.form = {
        matricule: '',
        nom: '',
        taux_horaire: '',
        nombre_heures: ''
      }
      this.errors = {
        matricule: '',
        nom: '',
        taux_horaire: '',
        nombre_heures: ''
      }
    },
  async ajouterEnseignant() {
  Object.keys(this.form).forEach(field => this.validateField(field));

  if (this.hasErrors) {
    this.toast.error('Veuillez corriger les erreurs dans le formulaire');
    return;
  }

  this.loading = true;

  const user_id = localStorage.getItem('user_id');
  if (!user_id) {
    this.toast.error('Vous devez être connecté');
    this.loading = false;
    return;
  }

  const payload = { ...this.form, user_id };

  try {
    // Changer l'URL ici : retirer ?action=register
    const response = await fetch('http://localhost/enseignant-api/api/enseignants.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      throw new Error((data && data.message) || 'Erreur de connexion');
    }

    this.toast.success(data.message || 'Ajout réussi 🎉');
    this.resetForm();

  } catch (error) {
    this.toast.error(error.message || 'Erreur inattendue ❌');
  } finally {
    this.loading = false;
  }
}

  }}
</script>

<style scoped>
.error-message {
  position: absolute;
  bottom: -1px;
  left: 0;
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
}

.input-wrapper {
  position: relative;
  padding-bottom: 20px; /* Espace pour le message d'erreur */
}
.bdy {
   margin-top: -50px;
  background-color: #f5f5f5;
  
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
 
}

.ajout {
 
  width: 100%;
  max-width: 700px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.ajout h2 {
  color: #2E424D;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon-container {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e8f4fc;
  border-radius: 12px;
  margin-left: 80px;
}

.icon-container img {
  width: 40px;
  height: 40px;
}

.input-wrapper {
  position: relative;
  flex: 1;
}

input {
  width: 70%;
  padding: 15px 20px;
  font-size: 18px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  color: #2E424D;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #5B8291;
  outline: none;
  box-shadow: 0 0 0 3px rgba(91, 130, 145, 0.2);
}

label {
  position: absolute;
  left: 15px;
  top: 15px;
  color: #888;
  font-size: 18px;
  transition: all 0.3s ease;
  pointer-events: none;
  background: transparent;
  padding: 0 5px;
}

input:focus + label,
input:not(:placeholder-shown) + label {
  top: -23px;
  left: 10px;
  font-size: 16px;
  color: #5B8291;
  font-weight: 500;
}

.btn-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

button {
  padding: 12px 30px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

button[type="submit"] {
  background-color: white;
   color: #2E424D;
  border: 2px solid #2E424D;
  margin-right: 50px;
}

button[type="submit"]:hover {
  background-color: #2E424D;
   color: white;
  border: 2px solid #2E424D;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button[type="reset"] {
   margin-left: 50px;
  background-color: white;
  color: #8c554a;
  border: 2px solid #8c554a;
}

button[type="reset"]:hover {
  background-color: #8c554a;
  color: white;
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .ajout {
    padding: 30px 20px;
  }
  .icon-container {
 
  margin-left: 10px;
}
  .input-group {
    flex-direction: row;
    align-items: flex-start;
  }
  
  .icon-container {
    margin-bottom: 10px;
  }
  label {
 
  font-size: 12px;
 
}
  
  .btn-container {
    flex-direction: row;
    gap: 15px;
  }
  
  button {
    width: 50%;
  }
  button[type="submit"] {
  
  margin-right: 5px;
}
button[type="reset"] {
  
  margin-right: 5px;
}

}
</style>