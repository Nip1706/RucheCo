let utilisateurs;
fetch('users.json')
    .then(response => response.json())
    .then(data => {
        utilisateurs = data;
        afficherProfil();
    });

function afficherProfil() {
    const identifiant = localStorage.getItem('username');
    const user = utilisateurs.find(u => u.identifiant === identifiant);

    if (user) {
        document.getElementById('nom').textContent = user.nom;
        document.getElementById('prenom').textContent = user.prenom;
        document.getElementById('adresse').textContent = user.adresse;
        document.getElementById('email').textContent = user.email;
        document.getElementById('identifiant').textContent = user.identifiant;
        document.getElementById('telephone').textContent = user.telephone;
        document.querySelector('.profile-image').src = user.photo; // Afficher la photo de profil
    } else {
        alert('Utilisateur non trouvé');
    }
}