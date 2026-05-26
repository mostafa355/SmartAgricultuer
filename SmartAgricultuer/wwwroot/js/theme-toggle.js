// Theme System - Fast & Clean
(function () {
    'use strict';

    const THEME_KEY = 'app-theme';
    const themeBtn = document.getElementById('themeToggle');

    // Apply theme
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem(THEME_KEY, 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem(THEME_KEY, 'light');
        }
    }

    // Get current theme
    function getTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Initialize
    setTheme(getTheme());

    // Toggle on button click
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // Export
    window.Theme = {
        toggle: () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        }
    };
})();