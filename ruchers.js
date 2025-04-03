document.addEventListener('DOMContentLoaded', function() {
    let ruchers;
    fetch('ruchers.json')
        .then(response => response.json())
        .then(data => {
            ruchers = data;
            afficherRuchers();
        });

    let rucherCouleurs = {};

    function afficherRuchers() {
        const identifiantUtilisateur = localStorage.getItem('username');
        const ruchersContainer = document.getElementById('ruchers-container');
        const couleurs = [
            ['#4c76bf', '#6187bb'],
            ['#c45e5e', '#c6a576'],
            ['#09791e', '#9ac493'],
            ['#f39c12', '#e67e22'],
            ['#e74c3c', '#c0392b']
        ];

        const ruchersUtilisateur = ruchers.filter(rucher => rucher.identifiantUtilisateur === identifiantUtilisateur);

        ruchersUtilisateur.forEach((rucher, index) => {
            const rucherCard = document.createElement('div');
            rucherCard.className = 'rucher-card';
            const couleurDegrade = `linear-gradient(135deg, ${couleurs[index % couleurs.length][0]}, ${couleurs[index % couleurs.length][1]})`;
            rucherCard.style.background = couleurDegrade;
            rucherCouleurs[rucher.title] = couleurDegrade;
            rucherCard.innerHTML = `
                <h3>${rucher.title}</h3>
                <p><strong>Adresse :</strong> ${rucher.adresse}</p>
                <button onclick="window.voirRuches('${rucher.title}')">Voir les ruches</button>
            `;
            ruchersContainer.appendChild(rucherCard);
        });
    }

    window.voirRuches = function(rucherTitle) { // Rendre la fonction accessible globalement
        const rucher = ruchers.find(r => r.title === rucherTitle);
        if (rucher) {
            localStorage.setItem('rucherTitle', rucherTitle);
            localStorage.setItem('ruchesData', JSON.stringify(rucher.ruches));
            localStorage.setItem('rucherCouleur', rucherCouleurs[rucherTitle]);
            window.location.href = 'ruches-detail.html';
        }
    }
});