<template>
  <div class="bilan-container">
    <!-- Statistiques -->
    <div class="stats-container">
      <div class="stat-card total-card">
        <div class="stat-icon">
          <img src="../icone/total_96px.png" alt="Total">
        </div>
        <h3>Prestation totale</h3>
        <p>{{ formatNumber(totalPrestation) }} AR</p>
      </div>
      <div class="stat-card min-card">
        <div class="stat-icon">
          <img src="../icone/min_96px.png" alt="Minimum">
        </div>
        <h3>Prestation minimale</h3>
        <p>{{ formatNumber(minPrestation) }} AR</p>
      </div>
      <div class="stat-card max-card">
        <div class="stat-icon">
          <img src="../icone/max_96px.png" alt="Maximum">
        </div>
        <h3>Prestation maximale</h3>
        <p>{{ formatNumber(maxPrestation) }} AR</p>
      </div>
    </div>

    <!-- Graphique -->
    <div class="chart-container">
      <h2 class="chart-title">Bilan des prestations</h2>
      <canvas ref="prestationChart"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  name: 'BilanEnseignants',
  
  setup() {
    const toast = useToast();
    return { toast };
  },

  data() {
    return {
      enseignants: [],
      totalPrestation: 0,
      minPrestation: 0,
      maxPrestation: 0,
      chart: null,
      isLoading: false,
      apiUrl: 'https://steeven.wuaze.com/api/enseignants.php',
      user_id: localStorage.getItem('user_id') || null
    }
  },
  
  async mounted() {
    Chart.register(...registerables);
    
    if (!this.user_id) {
      this.toast.error('Veuillez vous connecter');
      this.$router.push('/login');
      return;
    }
    
    await this.chargerDonnees();
  },
  
  methods: {
    formatNumber(num) {
      return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    
    async chargerDonnees() {
      this.isLoading = true;
      try {
        const response = await axios.get(this.apiUrl, {
          params: {
            action: 'enseignants',
            user_id: this.user_id
          }
        });
        
        if (response.data.status === 'error') {
          throw new Error(response.data.message);
        }
        
        // Conversion des types numériques
        this.enseignants = response.data.map(enseignant => ({
          ...enseignant,
          taux_horaire: parseFloat(enseignant.taux_horaire),
          nombre_heures: parseInt(enseignant.nombre_heures),
          prestation: parseFloat(enseignant.taux_horaire) * parseInt(enseignant.nombre_heures)
        }));
        
        this.calculerStatistiques();
        this.initChart();
        
      } catch (error) {
        console.error("Erreur:", error);
        this.gestionErreur(error);
      } finally {
        this.isLoading = false;
      }
    },
    
    calculerStatistiques() {
      const prestations = this.enseignants.map(e => e.prestation);
      
      this.totalPrestation = prestations.reduce((a, b) => a + b, 0);
      
      if (prestations.length > 0) {
        this.minPrestation = Math.min(...prestations);
        this.maxPrestation = Math.max(...prestations);
      } else {
        this.minPrestation = 0;
        this.maxPrestation = 0;
      }
    },
    
    initChart() {
      if (!this.$refs.prestationChart) return;
      
      const ctx = this.$refs.prestationChart.getContext('2d');
      
      // Détruire le graphique existant
      if (this.chart) {
        this.chart.destroy();
      }
      
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total', 'Minimum', 'Maximum'],
          datasets: [{
            label: 'Montant (AR)',
            data: [this.totalPrestation, this.minPrestation, this.maxPrestation],
            backgroundColor: [
              'rgba(91, 130, 145, 0.7)',
              'rgba(244, 67, 54, 0.7)',
              'rgba(76, 175, 80, 0.7)'
            ],
            borderColor: [
              'rgba(91, 130, 145, 1)',
              'rgba(244, 67, 54, 1)',
              'rgba(76, 175, 80, 1)'
            ],
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return this.formatNumber(context.parsed.y) + ' AR';
                }
              }
            },
            title: {
              display: true,
              text: 'Statistiques des Prestations',
              font: {
                size: 16
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Montant (AR)',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              ticks: {
                callback: (value) => {
                  return this.formatNumber(value);
                }
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    },
    
    gestionErreur(error) {
      let message = "Erreur lors du chargement des données";
      
      if (error.response) {
        if (error.response.status === 401) {
          this.$router.push('/login');
          return;
        }
        message = error.response.data?.message || message;
      } else {
        message = error.message || message;
      }
      
      this.toast.error(message);
    }
  },
  
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
</script>

<style scoped>
.bilan-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
  margin-top: -120px;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  flex-wrap: wrap;
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  flex: 1;
  height: 120px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* Cartes avec couleurs correspondant à l'histogramme */
.total-card p {
  color: #5B8291; /* Bleu - comme la barre Total */
}

.min-card p {
  color: #F44336; /* Rouge - comme la barre Minimum */
}

.max-card p {
  color: #4CAF50; /* Vert - comme la barre Maximum */
}

.stat-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* Icônes avec fonds colorés correspondants */
.total-card .stat-icon {
  background-color: rgba(91, 130, 145, 0.1); /* Bleu clair */
}

.min-card .stat-icon {
  background-color: rgba(244, 67, 54, 0.1); /* Rouge clair */
}

.max-card .stat-icon {
  background-color: rgba(76, 175, 80, 0.1); /* Vert clair */
}

.stat-icon img {
  width: 30px;
  height: 30px;
}

.stat-card h3 {
  margin: 0 0 10px;
  color: #2E424D;
  font-size: 18px;
  font-weight: 600;
}

.stat-card p {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.chart-container {
  background: transparent;
  padding: 25px;
  border-radius: 12px;
  height: 395px;
}

.chart-title {
  color: #2E424D;
  text-align: center;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-container {
    flex-direction: column;
  }
  
  .stat-card {
    min-width: 100%;
  }
  
  .bilan-container {
    padding: 20px 15px;
  }
  
  .chart-container {
    padding: 15px;
    width: 100%;
  }
}
</style>
