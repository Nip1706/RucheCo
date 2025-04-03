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

    document.querySelector('main header h2').textContent = `Ruches de ${rucherTitre}`;

    function displayRuches() {
        ruchesGridContainer.innerHTML = '';
        ruchesData.forEach(ruche => {
            const rucheCard = document.createElement('div');
            rucheCard.className = 'ruche-card';
            rucheCard.style.background = rucherCouleur;

            const tempOk = parseFloat(ruche.temperature) >= 22 && parseFloat(ruche.temperature) <= 24;
            const humiditeOk = parseFloat(ruche.humidity) >= 50 && parseFloat(ruche.humidity) <= 70;
            const couvercleOk = ruche.couvercle === 'Fermé';

            const allConditionsOk = tempOk && humiditeOk && couvercleOk;

            rucheCard.innerHTML = `
                <h4>${ruche.nom} ${
                    allConditionsOk
                        ? '<i class="fas fa-check-circle" style="color: green;"></i>'
                        : '<i class="fas fa-exclamation-triangle" style="color: red;"></i>'
                }</h4>
                <p><i class="fas ${tempOk ? 'fa-check-circle' : 'fa-times-circle'}"></i> Température : ${ruche.temperature}</p>
                <p><i class="fas ${humiditeOk ? 'fa-check-circle' : 'fa-times-circle'}"></i> Humidité : ${ruche.humidity}</p>
                <p><i class="fas ${couvercleOk ? 'fa-check-circle' : 'fa-times-circle'}"></i> Couvercle : ${ruche.couvercle}</p>
                <button onclick="intervenir('${ruche.nom}')">Intervention</button>
            `;

            rucheCard.addEventListener('click', () => {
                localStorage.setItem('rucheData', JSON.stringify(ruche));
                window.location.href = 'ruche-graph.html';
            });

            ruchesGridContainer.appendChild(rucheCard);
        });
    }

    displayRuches();

    function intervenir(rucheNom) {
        alert(`Intervention sur la ruche ${rucheNom}`);
    }

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

        // Ajouter la nouvelle ruche au fichier ruchers.json
        fetch('ruchers.json')
            .then(response => response.json())
            .then(data => {
                const rucherIndex = data.findIndex(rucher => rucher.identifiantUtilisateur === identifiantUtilisateur && rucher.title === rucherTitre);
                if (rucherIndex !== -1) {
                    data[rucherIndex].ruches.push(newRuche);
                    fetch('ruchers.json', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors de la mise à jour de ruchers.json');
                        }
                    })
                    .catch(error => {
                        console.error('Erreur :', error);
                    });
                }
            });

        modal.style.display = 'none';
        displayRuches();
        updateCharts();
    });

    function updateCharts() {
        if (ruchesData.length > 0) {
            const ctx = document.getElementById('rucherChart').getContext('2d');
            const labels = ruchesData.map(ruche => ruche.nom);
            const temperatures = ruchesData.map(ruche => parseInt(ruche.temperature));
            const humidities = ruchesData.map(ruche => parseInt(ruche.humidity));

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Température (°C)',
                        data: temperatures,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Humidité (%)',
                        data: humidities,
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
        }

        if (ruchesData.length > 0) {
            const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
            const labelsTemp = ['0h', '3h', '6h', '9h', '12h', '15h', '18h', '21h'];
            const datasetsTemp = [];

            ruchesData.forEach(ruche => {
                const temperaturesTemp = labelsTemp.map(() => {
                    const baseTemp = parseInt(ruche.temperature);
                    const variation = Math.random() * 4 - 2;
                    return baseTemp + variation;
                });

                datasetsTemp.push({
                    label: `Température ${ruche.nom} (°C)`,
                    data: temperaturesTemp,
                    borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                });
            });

            new Chart(ctxTemp, {
                type: 'line',
                data: {
                    labels: labelsTemp,
                    datasets: datasetsTemp
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
        }
    }

    updateCharts();
});