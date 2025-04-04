// theme.js
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        // Vous pourriez avoir besoin de mettre à jour le texte d'un bouton de bascule ici si présent sur la page
    }
});