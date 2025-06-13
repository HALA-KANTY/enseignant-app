<template>
  <div>
      <!-- Barre de recherche et filtre -->
    <div class="search-filter-container">
      <div class="search-box">
        <select v-model="searchType" class="search-select">
          <option value="nom">Nom</option>
          <option value="matricule">Matricule</option>
        </select>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher..." 
          class="search-input"
          @input="filtrerEnseignants"
        >
        <button class="search-btn" @click="filtrerEnseignants">
          <img src="../icone/search.png" alt="Rechercher">
        </button>
      </div>
    </div>

    <!-- Formulaire de modification -->
    <div v-if="showEditForm" class="edit-form-overlay">
      <div class="edit-form-container">
        <h2>Modifier l'enseignant</h2>
        <form @submit.prevent="validerModification">
          <div class="form-group">
            <div class="icon-container">
              <img src="../icone/binary_file_96px.png" alt="Matricule">
            </div>
            <div class="input-wrapper">
              <input v-model="editedTeacher.matricule" readonly>
              <label>Matricule</label>
            </div>
          </div>
          
          <div class="form-group">
            <div class="icon-container">
              <img src="../icone/nom.png" alt="Nom">
            </div>
            <div class="input-wrapper">
              <input v-model="editedTeacher.nom" required>
              <label>Nom et Prénom</label>
            </div>
          </div>
          
          <div class="form-group">
            <div class="icon-container">
              <img src="../icone/paper_money_96px.png" alt="Taux">
            </div>
            <div class="input-wrapper">
              <input v-model.number="editedTeacher.taux_horaire" type="number" step="0.01" required>
              <label>Taux horaire</label>
            </div>
          </div>
          
          <div class="form-group">
            <div class="icon-container">
              <img src="../icone/teacher_96px.png" alt="Heures">
            </div>
            <div class="input-wrapper">
              <input v-model.number="editedTeacher.nombre_heures" type="number" required>
              <label>Nombre d'heures</label>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-save">Enregistrer</button>
            <button type="button" @click="annulerModification" class="btn-cancel">Annuler</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Liste des enseignants -->
    <div class="liste-container">
      <table class="enseignant-table">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Nom et Prénom</th>
            <th>Taux horaire</th>
            <th>Heures</th>
            <th>Prestation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
         <tr v-for="enseignant in filteredEnseignants" :key="enseignant.matricule">
            <td>{{ enseignant.matricule || '-' }}</td>
            <td>{{ enseignant.nom || '-' }}</td>
            <td>{{ enseignant.taux_horaire ? enseignant.taux_horaire.toFixed(0) : '-' }} AR</td>
            <td>{{ enseignant.nombre_heures || '-' }} H</td>
            <td>{{ calculerPrestation(enseignant) }} AR</td>
            <td class="actions">
              <button @click="modifierEnseignant(enseignant)" class="icon-btn" title="Modifier">
                <img src="../icone/edit.png" alt="Modifier">
              </button>
             <button @click="supprimerEnseignant(enseignant.id)" class="icon-btn" title="Supprimer">
  <img src="../icone/delete.png" alt="Supprimer">
</button>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  name: 'ListeEnseignants',
  
  setup() {
    const toast = useToast();
    return { toast };
  },

  data() {
    return {
      enseignants: [],
      filteredEnseignants: [],
      showEditForm: false,
      editedTeacher: {
        id : null,
      
        nom: '',
        taux_horaire: 0,
        nombre_heures: 0
      },
      searchQuery: '',
      searchType: 'nom',
      originalEnseignants: [],
      user_id: localStorage.getItem('user_id') || null
    };
  },

  mounted() {
    if (!this.user_id) {
      this.toast.error('Utilisateur non connecté');
      return;
    }
    this.chargerEnseignants();
  },

  methods: {
    async chargerEnseignants() {
      if (!this.user_id) {
        this.toast.error('Utilisateur non connecté');
        return;
      }
      try {
        const response = await axios.get(`http://localhost/enseignant-api/api/enseignants.php?user_id=${this.user_id}`);
        this.enseignants = response.data;
        this.originalEnseignants = [...response.data];
        this.filteredEnseignants = [...response.data];
      } catch (error) {
        console.error("Erreur:", error.response?.data || error.message);
        this.toast.error("Erreur lors du chargement : " + (error.response?.data?.message || error.message));
        this.enseignants = [];
        this.filteredEnseignants = [];
      }
    },

    filtrerEnseignants() {
      if (!this.searchQuery) {
        this.filteredEnseignants = [...this.originalEnseignants];
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredEnseignants = this.originalEnseignants.filter(enseignant => {
        if (this.searchType === 'nom') {
          return enseignant.nom.toLowerCase().includes(query);
        } else {
          return enseignant.matricule.toLowerCase().includes(query);
        }
      });
    },

  async supprimerEnseignant(id) {
  if (!this.user_id) {
    this.toast.error('Utilisateur non connecté');
    return;
  }
  if (confirm("Voulez-vous vraiment supprimer cet enseignant ?")) {
    try {
      await axios.delete(`http://localhost/enseignant-api/api/enseignants.php?id=${id}&user_id=${this.user_id}`);
      await this.chargerEnseignants();
      this.toast.success("Enseignant supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      this.toast.error("Erreur lors de la suppression : " + (error.response?.data?.message || error.message));
    }
  }
},



    calculerPrestation(enseignant) {
      if (!enseignant || typeof enseignant.taux_horaire !== 'number' || 
          typeof enseignant.nombre_heures !== 'number') {
        return '0.00';
      }
      return (enseignant.taux_horaire * enseignant.nombre_heures).toFixed(0);
    },

    modifierEnseignant(enseignant) {
  this.editedTeacher = {
    id: enseignant.id,
    nom: enseignant.nom,
    taux_horaire: parseFloat(enseignant.taux_horaire),
    nombre_heures: parseInt(enseignant.nombre_heures)
  };
  this.showEditForm = true;
},


   async validerModification() {
  if (!this.user_id) {
    this.toast.error('Utilisateur non connecté');
    return;
  }
  if (confirm("Voulez-vous vraiment Modifier cet enseignant ?")) {
    try {
      const response = await axios({
        method: 'put',
        url: 'http://localhost/enseignant-api/api/enseignants.php',
        data: {
          ...this.editedTeacher,  // contient id, nom, taux_horaire, nombre_heures
          user_id: this.user_id
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 'success') {
        this.showEditForm = false;
        await this.chargerEnseignants();
        this.editedTeacher = {
          id: null,
          nom: '',
          taux_horaire: 0,
          nombre_heures: 0
        };
        this.toast.success("Modification enregistrée avec succès !");
      } else {
        throw new Error(response.data.message || "Erreur inconnue");
      }
    } catch (error) {
      console.error("Erreur modification:", error);
      this.toast.error("Erreur lors de la modification : " + (error.response?.data?.message || error.message));
    }
  }
},


    annulerModification() {
      this.showEditForm = false;
      this.editedTeacher = {
        matricule: '',
        nom: '',
        taux_horaire: 0,
        nombre_heures: 0
      };
    }
  }
};
</script>


<style scoped>
.search-filter-container {
margin-top: -50px;
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  background-color: #f5f5f5;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 30px;
  padding: 5px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 350px;
}

.search-select {
  border: none;
  outline: none;
  padding: 8px;
  margin-right: 10px;
  border-right: 1px solid #e0e0e0;
  background: transparent;
  color: #2E424D;
  font-weight: 500;
  cursor: pointer;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 14px;
}

.search-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.search-btn img {
  width: 20px;
  height: 20px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.search-btn:hover img {
  opacity: 1;
}

body {
  background-color: #f5f5f5;
}

.liste-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f5f5;
}

.enseignant-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.enseignant-table th, 
.enseignant-table td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.enseignant-table th {
  background-color: #2E424D;
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.enseignant-table tr {
  color: #333;
  font-size: 15px;
  transition: background-color 0.2s;
}

.enseignant-table tr:hover {
  background-color: #f0f8ff;
}

.enseignant-table td:empty::before {
  content: '-';
  color: #999;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s;
}

.icon-btn:hover {
  transform: scale(1.1);
}

.icon-btn img {
  width: 24px;
  height: 24px;
}

/* Formulaire de modification */
.edit-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.edit-form-container {
  width: 600px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.edit-form-container h2 {
  color: #2E424D;
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;
  font-weight: 600;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.icon-container {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e8f4fc;
  border-radius: 10px;
  margin-right: 15px;
    margin-left: 15%;
}

.icon-container img {
  width: 25px;
  height: 25px;
}

.input-wrapper {
  position: relative;
  flex: 1;
}

input {
  width: 70%;
  padding: 12px 15px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #333;
  transition: all 0.3s;
}

input:focus {
  border-color: #5B8291;
  outline: none;
  box-shadow: 0 0 0 3px rgba(91, 130, 145, 0.2);
}

input:read-only {
  background-color: #f5f5f5;
  color: #777;
}

label {
  position: absolute;
  left: 15px;
  top: 12px;
  color: #888;
  font-size: 16px;
  transition: all 0.3s;
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

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.btn-save {
  background-color: white;
   color: #2E424D;
  border: 2px solid #2E424D;
  margin-right: 50px;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover {
  background-color: #2E424D;
   color: white;
  border: 2px solid #2E424D;
  transform: translateY(-2px);
}

.btn-cancel {
  background-color: white;
  color: #8c554a;
  border: 2px solid #8c554a;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background-color: #8c554a;
  color: white;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .liste-container {
    padding: 15px;
  }
  
  .enseignant-table {
    font-size: 14px;
  }
  
  .enseignant-table th, 
  .enseignant-table td {
    padding: 10px 5px;
  }
  
  .edit-form-container {
    width: 90%;
    padding: 20px;
  }
  
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .icon-container {
    margin-bottom: 10px;
    margin-right: 0;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn-save,
  .btn-cancel {
    width: 100%;
  }
}
</style>