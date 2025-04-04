document.addEventListener('DOMContentLoaded', function() {
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');

    // Appliquer le thème sauvegardé au chargement et initialiser la checkbox
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggleCheckbox.checked = true;
    }

    themeToggleCheckbox.addEventListener('change', function() {
        body.classList.toggle('light-mode');
        const isLightMode = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });
});