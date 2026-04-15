(function() {
    const sidebar = document.getElementById('sidebar');
    const historyDrop = document.getElementById('historyDropdown');
    const historySubmenu = document.getElementById('historySubmenu');

    // Toggle Sidebar
    document.getElementById('toggleSidebar').onclick = () => {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('collapsed', sidebar.classList.contains('collapsed'));
    };

    // History Click
    historyDrop.onclick = (e) => {
        e.stopPropagation();
        if (sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed');
            setTimeout(() => historySubmenu.classList.add('open'), 300);
        } else {
            historySubmenu.classList.toggle('open');
        }
        localStorage.setItem('historyOpen', historySubmenu.classList.contains('open'));
    };

    // Restore on load
    if (localStorage.getItem('collapsed') === 'true') sidebar.classList.add('collapsed');
    if (localStorage.getItem('historyOpen') === 'true') historySubmenu.classList.add('open');

    const profileTrigger = document.getElementById('profileTrigger');
const profileCard = document.getElementById('profileCard');

// فتح/قفل لما تدوس
profileTrigger.onclick = (e) => {
    e.stopPropagation();
    profileCard.classList.toggle('show');
};

// قفل لما تدوس بره
document.onclick = (e) => {
    if (!profileCard.contains(e.target) && e.target !== profileTrigger) {
        profileCard.classList.remove('show');
    }
};

})();