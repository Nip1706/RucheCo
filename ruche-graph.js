document.addEventListener('DOMContentLoaded', function() {
    const rucheData = JSON.parse(localStorage.getItem('rucheData'));
    let currentPeriod = 'daily'; // Période par défaut
    let temperatureChartInstance = null;
    let humidityChartInstance = null;

    if (rucheData) {
        document.title = `Graphiques de la ruche ${rucheData.nom}`;
        const headerElement = document.getElementById('ruche-nom-header');
        if (headerElement) {
            headerElement.textContent = `Graphiques de la ruche ${rucheData.nom}`;
        }
        const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
        const ctxHum = document.getElementById('humidityChart').getContext('2d');

        function updateGraphs(period) {
            let labels = [];
            let temperatures = [];
            let humidities = [];

            if (period === 'daily') {
                labels = ['0h', '3h', '6h', '9h', '12h', '15h', '18h', '21h'];
                temperatures = labels.map(() => {
                    const baseTemp = parseFloat(rucheData.temperature);
                    const variation = Math.random() * 4 - 2;
                    return baseTemp + variation;
                });
                humidities = labels.map(() => {
                    const baseHum = parseFloat(rucheData.humidity);
                    const variation = Math.random() * 10 - 5;
                    return baseHum + variation;
                });
            } else if (period === 'weekly') {
                labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
                temperatures = labels.map(() => {
                    const baseTemp = parseFloat(rucheData.temperature);
                    const variation = Math.random() * 6 - 3;
                    return baseTemp + variation;
                });
                humidities = labels.map(() => {
                    const baseHum = parseFloat(rucheData.humidity);
                    const variation = Math.random() * 15 - 7.5;
                    return baseHum + variation;
                });
            } else if (period === 'monthly') {
                labels = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
                temperatures = labels.map((month, index) => {
                    let baseTemp = parseFloat(rucheData.temperature);
                    if (index >= 5 && index <= 7) { // Juin, Juillet, Août (été)
                        baseTemp += 5 + Math.random() * 3;
                    } else if (index >= 11 || index <= 1) { // Décembre, Janvier, Février (hiver)
                        baseTemp -= 5 + Math.random() * 3;
                    } else {
                        baseTemp += Math.random() * 4 - 2;
                    }
                    return baseTemp;
                });
                humidities = labels.map(() => {
                    const baseHum = parseFloat(rucheData.humidity);
                    const variation = Math.random() * 20 - 10;
                    return baseHum + variation;
                });
            }

            // Détruire les graphiques existants
            if (temperatureChartInstance) {
                temperatureChartInstance.destroy();
            }
            if (humidityChartInstance) {
                humidityChartInstance.destroy();
            }

            // Graphique de température
            temperatureChartInstance = new Chart(ctxTemp, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Température (°C)',
                        data: temperatures,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: 'white' // Couleur du texte de l'axe Y
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)' // Couleur des lignes de la grille
                            }
                        },
                        x: {
                            ticks: {
                                color: 'white' // Couleur du texte de l'axe X
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)' // Couleur des lignes de la grille
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: 'white' // Couleur du texte de la légende
                            }
                        }
                    }
                }
            });

            // Graphique d'humidité
            humidityChartInstance = new Chart(ctxHum, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Humidité (%)',
                        data: humidities,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: 'white' // Couleur du texte de l'axe Y
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)' // Couleur des lignes de la grille
                            }
                        },
                        x: {
                            ticks: {
                                color: 'white' // Couleur du texte de l'axe X
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)' // Couleur des lignes de la grille
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: 'white' // Couleur du texte de la légende
                            }
                        }
                    }
                }
            });
        }

        window.changePeriod = function(period) {
            currentPeriod = period;
            updateGraphs(currentPeriod);
        };

        updateGraphs(currentPeriod); // Initialiser les graphiques avec la période par défaut
    }
});