(function () {
    const sidebar = document.getElementById('sidebar');
    const historyDrop = document.getElementById('historyDropdown');
    const historySubmenu = document.getElementById('historySubmenu');
    const maincontet = document.getElementById('mainContent');

    // وظيفة موحدة لتغيير حالة السايدبار والمحتوى معاً
    function updateSidebarState(isCollapsed) {
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            maincontet.classList.replace('content-normal', 'content-expanded');
        } else {
            sidebar.classList.remove('collapsed');
            maincontet.classList.replace('content-expanded', 'content-normal');
        }
        localStorage.setItem('collapsed', isCollapsed);
    }

    // Toggle Sidebar (الأيقونة)
    document.getElementById('toggleSidebar').onclick = () => {
        const isCollapsed = !sidebar.classList.contains('collapsed');
        updateSidebarState(isCollapsed);
    };

    // History Click
    historyDrop.onclick = (e) => {
        e.stopPropagation();

        // لو السايدبار مقفول، افتحه وثبته كأنه اتفتح من الأيقونة
        if (sidebar.classList.contains('collapsed')) {
            updateSidebarState(false); // دي اللي هتخليه يثبت وميقفلش تاني

            setTimeout(() => {
                historySubmenu.classList.add('open');
                localStorage.setItem('historyOpen', 'true');
            }, 300);
        } else {
            const isOpen = historySubmenu.classList.toggle('open');
            localStorage.setItem('historyOpen', isOpen);
        }
    };

    // Restore on load - تنظيف الكود ومنع التكرار
    const savedCollapsed = localStorage.getItem('collapsed') === 'true';
    const savedHistoryOpen = localStorage.getItem('historyOpen') === 'true';

    if (savedCollapsed) {
        sidebar.classList.add('collapsed');
        maincontet.classList.replace('content-normal', 'content-expanded');
    } else {
        sidebar.classList.remove('collapsed');
        maincontet.classList.replace('content-expanded', 'content-normal');
    }

    if (savedHistoryOpen && !savedCollapsed) {
        historySubmenu.classList.add('open');
    }

    // Profile Logic
    const profileTrigger = document.getElementById('profileTrigger');
    const profileCard = document.getElementById('profileCard');

    profileTrigger.onclick = (e) => {
        e.stopPropagation();
        profileCard.classList.toggle('show');
    };

    document.onclick = (e) => {
        if (profileCard && !profileCard.contains(e.target) && e.target !== profileTrigger) {
            profileCard.classList.remove('show');
        }
    };
})();