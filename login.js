let utilisateurs;
fetch('users.json')
    .then(response => response.json())
    .then(data => utilisateurs = data);

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = utilisateurs.find(u => u.identifiant === username && u.mot_de_passe === password);
    if (user) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', user.identifiant); // Stocker l'identifiant
        window.location.href = 'index.html';
    } else {
        alert('Identifiant ou mot de passe incorrect');
    }
}