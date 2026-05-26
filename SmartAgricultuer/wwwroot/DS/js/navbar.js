function initializeNavbar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const navItems = document.querySelectorAll('.nav-item');
    const tablesToggle = document.getElementById('tablesToggle');
    const tablesDropdown = document.getElementById('tablesDropdown');

    const currentPath = window.location.pathname.split("/").pop(); 
    
    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        
        if (itemHref === currentPath) {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            if (item.classList.contains('dropdown-item')) {
                tablesDropdown?.classList.add('open');
                tablesToggle?.querySelector('.arrow-icon')?.classList.add('rotate-arrow');
                tablesToggle?.classList.add('active');
            }
        }
    });

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            if (sidebar.classList.contains('collapsed')) {
                tablesDropdown?.classList.remove('open');
                tablesToggle?.querySelector('.arrow-icon')?.classList.remove('rotate-arrow');
            }
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.id === 'tablesToggle') {
                e.preventDefault();
                if (sidebar && !sidebar.classList.contains('collapsed')) {
                    tablesDropdown?.classList.toggle('open');
                    this.querySelector('.arrow-icon')?.classList.toggle('rotate-arrow');
                }
                return; 
            }

            navItems.forEach(nav => nav.classList.remove('active', 'logout-active'));
            this.classList.add(this.classList.contains('logout-item') ? 'logout-active' : 'active');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const placeholder = document.getElementById('navbar-placeholder');
    const menuToggleInDOM = document.getElementById('menuToggle');

    if (placeholder) {
        fetch('navbar.html')
            .then(response => response.text())
            .then(data => {
                placeholder.innerHTML = data;
                initializeNavbar(); 
            });
    } else if (menuToggleInDOM) {
        initializeNavbar();
    }
});