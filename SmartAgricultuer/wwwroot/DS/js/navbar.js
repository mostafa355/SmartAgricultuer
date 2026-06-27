document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const tablesToggle = document.getElementById('tablesToggle');
    const tablesDropdown = document.getElementById('tablesDropdown');

    const navLinks = document.querySelectorAll('.nav-item, .dropdown-item');

    const currentUrl = window.location.pathname.toLowerCase();

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const lowerHref = href.toLowerCase();
            if (currentUrl === lowerHref || currentUrl.endsWith(lowerHref)) {

                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

                if (link.classList.contains('dropdown-item')) {
                    link.classList.add('active'); 
                    tablesToggle?.classList.add('active');
                    tablesDropdown?.classList.add('open');
                    tablesToggle?.querySelector('.arrow-icon')?.classList.add('rotate-arrow');
                } else {
                    link.classList.add('active');
                }
            }
        }
    });

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            // إضافة كلاس على الـ body للتحكم في العناصر الخارجية مثل .main
            document.body.classList.toggle('sidebar-is-collapsed');

            if (sidebar.classList.contains('collapsed')) {
                tablesDropdown?.classList.remove('open');
                tablesToggle?.querySelector('.arrow-icon')?.classList.remove('rotate-arrow');
            }
        });
    }

    if (tablesToggle) {
        tablesToggle.addEventListener('click', function (e) {
            if (sidebar && sidebar.classList.contains('collapsed')) {
                return; 
            }

            e.preventDefault();
            tablesDropdown?.classList.toggle('open');
            this.querySelector('.arrow-icon')?.classList.toggle('rotate-arrow');
        });
    }
});

function handleLogout() {
    Swal.fire({
        title: 'Do you want to log out?',
        text: "The current session will end and you will return to the login page.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#006d3d', 
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('logoutForm').submit();
        }
    });
}