document.addEventListener('DOMContentLoaded', function() {
    const ruchesData = JSON.parse(localStorage.getItem('ruchesData')) || [];
    const rucherCouleur = localStorage.getItem('rucherCouleur');
    const rucherTitre = localStorage.getItem('rucherTitle');
    const ruchesGridContainer = document.getElementById('ruches-grid-container');
    const ruchesGridContainer2 = document.getElementById('ruches-grid-container2');
    const modal = document.getElementById('add-ruche-modal');
    const addRucheIcon = document.getElementById('add-ruche-icon');
    const closeBtn = document.querySelector('.close');
    const addRucheForm = document.getElementById('add-ruche-form');
    const identifiantUtilisateur = localStorage.getItem('identifiantUtilisateur');
    const rucherChartCanvas = document.getElementById('rucherChart');
    const temperatureChartCanvas = document.getElementById('temperatureChart');
    let rucherChartInstance;
    let temperatureChartInstance;
    let currentlySelectedRuche = null;

    document.querySelector('main header h2').textContent = `Ruches de ${rucherTitre}`;

    function displayRuches() {
        ruchesGridContainer.innerHTML = '';
        ruchesData.forEach(ruche => {
            const rucheCard = document.createElement('div');
            rucheCard.className = 'ruche-card';
            rucheCard.style.background = rucherCouleur;
            rucheCard.style.cursor = 'pointer';

            const tempOk = parseFloat(ruche.temperature) >= 22 && parseFloat(ruche.temperature) <= 24;
            const humiditeOk = parseFloat(ruche.humidity) >= 50 && parseFloat(ruche.humidity) <= 70;
            const couvercleOk = ruche.couvercle === 'Fermé';

            const allConditionsOk = tempOk && humiditeOk && couvercleOk;

            rucheCard.innerHTML = `
                <h4>${ruche.nom} ${
                    allConditionsOk
                        ? '<i class="fas fa-check-circle" style="color: green;"></i>'
                        : '<i class="fas fa-exclamation-triangle" style="color: red;"></i>'
                } <span id="intervention-icon-${ruche.nom}"></span></h4>
                <p><i class="fas ${tempOk ? 'fa-check-circle' : 'fa-times-circle'}"></i> Température : ${ruche.temperature}</p>
                <p><i class="fas ${humiditeOk ? 'fa-check-circle' : 'fa-times-circle'}"></i> Humidité : ${ruche.humidity}</p>
                <p><i class="fas ${couvercleOk ? 'fa-check-circle' : 'fa-times-circle'}"></i> Couvercle : ${ruche.couvercle}</p>
                <button data-ruche-nom="${ruche.nom}" class="intervention-button">Intervention</button>
            `;

            rucheCard.addEventListener('click', () => {
                currentlySelectedRuche = ruche;
                updateCharts(ruche);
            });

            ruchesGridContainer.appendChild(rucheCard);
        });

        const interventionButtons = document.querySelectorAll('.intervention-button');
        interventionButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                const rucheNom = this.dataset.rucheNom;
                const interventionIconSpan = document.getElementById(`intervention-icon-${rucheNom}`);
                const iconHTML = '<i class="fas fa-tools" style="color: orange; font-size: 0.8em;"></i>';
                if (interventionIconSpan.innerHTML === iconHTML) {
                    interventionIconSpan.innerHTML = '';
                } else {
                    interventionIconSpan.innerHTML = iconHTML;
                }
            });
        });

        if (ruchesData.length > 0) {
            updateCharts();
        }
    }

    displayRuches();

    rucherChartCanvas.addEventListener('click', () => {
        if (currentlySelectedRuche) {
            localStorage.setItem('rucheData', JSON.stringify(currentlySelectedRuche));
            window.location.href = 'ruche-graph.html';
        }
    });

    temperatureChartCanvas.addEventListener('click', () => {
        if (currentlySelectedRuche) {
            localStorage.setItem('rucheData', JSON.stringify(currentlySelectedRuche));
            window.location.href = 'ruche-graph.html';
        }
    });

    addRucheIcon.onclick = function() {
        modal.style.display = 'block';
    };

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    addRucheForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nom = document.getElementById('nom').value;
        const temperature = document.getElementById('temperature').value;
        const humidity = document.getElementById('humidity').value;
        const couvercle = document.getElementById('couvercle').value;

        const newRuche = {
            nom: nom,
            temperature: temperature,
            humidity: humidity,
            couvercle: couvercle
        };

        ruchesData.push(newRuche);
        localStorage.setItem('ruchesData', JSON.stringify(ruchesData));

        fetch('ruchers.json')
            .then(response => response.json())
            .then(data => {
                const rucherIndex = data.findIndex(rucher => rucher.identifiantUtilisateur === identifiantUtilisateur && rucher.title === rucherTitre);
                if (rucherIndex !== -1) {
                    data[rucherIndex].ruches.push(newRuche);
                    return fetch('ruchers.json', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                }
                return Promise.reject('Rucher non trouvé dans ruchers.json');
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour de ruchers.json');
                }
            })
            .catch(error => {
                console.error('Erreur :', error);
            });

        modal.style.display = 'none';
        displayRuches();
        updateCharts();
    });

    function updateCharts(selectedRuche) {
        if (rucherChartInstance) {
            rucherChartInstance.destroy();
        }
        if (temperatureChartInstance) {
            temperatureChartInstance.destroy();
        }

        if (selectedRuche) {
            const ctxBar = rucherChartCanvas.getContext('2d');
            rucherChartInstance = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: [selectedRuche.nom],
                    datasets: [{
                        label: 'Température (°C)',
                        data: [parseInt(selectedRuche.temperature)],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Humidité (%)',
                        data: [parseInt(selectedRuche.humidity)],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            const ctxLine = temperatureChartCanvas.getContext('2d');
            const labelsTemp = ['0h', '3h', '6h', '9h', '12h', '15h', '18h', '21h'];
            const temperaturesTemp = labelsTemp.map(() => {
                const baseTemp = parseInt(selectedRuche.temperature);
                const variation = Math.random() * 4 - 2;
                return baseTemp + variation;
            });

            temperatureChartInstance = new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: labelsTemp,
                    datasets: [{
                        label: `Température ${selectedRuche.nom} (°C)`,
                        data: temperaturesTemp,
                        borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
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
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    }
                }
            });
            currentlySelectedRuche = selectedRuche;
        } else {
            const ctxBar = rucherChartCanvas.getContext('2d');
            const labelsBar = ruchesData.map(ruche => ruche.nom);
            const temperaturesBar = ruchesData.map(ruche => parseInt(ruche.temperature));
            const humiditiesBar = ruchesData.map(ruche => parseInt(ruche.humidity));

            rucherChartInstance = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: labelsBar,
                    datasets: [{
                        label: 'Température (°C)',
                        data: temperaturesBar,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Humidité (%)',
                        data: humiditiesBar,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            const ctxLine = temperatureChartCanvas.getContext('2d');
            const labelsLine = ['0h', '3h', '6h', '9h', '12h', '15h', '18h', '21h'];
            const datasetsLine = [];

            ruchesData.forEach(ruche => {
                const temperaturesLine = labelsLine.map(() => {
                    const baseTemp = parseInt(ruche.temperature);
                    const variation = Math.random() * 4 - 2;
                    return baseTemp + variation;
                });

                datasetsLine.push({
                    label: `Température ${ruche.nom} (°C)`,
                    data: temperaturesLine,
                    borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                });
            });

            temperatureChartInstance = new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: labelsLine,
                    datasets: datasetsLine
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            maxVisibleItems: 100
                        }
                    }
                }
            });
            currentlySelectedRuche = null;
        }
    }
});