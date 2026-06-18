(function () {
    const sidebar = document.getElementById('sidebar');
    const historyDrop = document.getElementById('historyDropdown');
    const historySubmenu = document.getElementById('historySubmenu');
    const maincontet = document.getElementById('mainContent');
    const navContainer = document.querySelector('.nav');
    const scrollKey = 'sidebar_scroll_position';

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
        if (sidebar.classList.contains('collapsed')) {
            updateSidebarState(false);
            setTimeout(() => {
                historySubmenu.classList.add('open');
                localStorage.setItem('historyOpen', 'true');
            }, 300);
        } else {
            const isOpen = historySubmenu.classList.toggle('open');
            localStorage.setItem('historyOpen', isOpen);
        }
    };

    // --- منطق استعادة الحالة والسكرول عند التحميل ---
    const savedCollapsed = localStorage.getItem('collapsed') === 'true';
    const savedHistoryOpen = localStorage.getItem('historyOpen') === 'true';
    const savedScrollPos = localStorage.getItem(scrollKey);

    // استعادة حالة السايدبار
    updateSidebarState(savedCollapsed);

    // استعادة فتح الهيستري (لو مش مقفول) أو لو إحنا في صفحة Result
    if ((savedHistoryOpen && !savedCollapsed) || window.location.pathname.includes('Result') || document.querySelector('.active-scan')) {
        if (historySubmenu) {
            historySubmenu.classList.add('open');
            if (historyDrop) historyDrop.classList.add('open');
        }
    }

    // استعادة السكرول "بنعومة واحترافية"
    if (savedScrollPos && navContainer) {
        // نلغي الـ smooth مؤقتاً عشان ينط للمكان صح فوراً
        navContainer.style.scrollBehavior = 'auto';

        // استخدمنا requestAnimationFrame عشان نضمن إن الـ Submenu فتحت والـ Layout اتحسب
        requestAnimationFrame(() => {
            navContainer.scrollTop = savedScrollPos;
            // نرجع الـ smooth بعد التحميل عشان السكرول اليدوي يفضل ناعم
            setTimeout(() => {
                navContainer.style.scrollBehavior = 'smooth';
            }, 50);
        });
    }

    // حفظ السكرول عند الضغط على أي رابط
    if (navContainer) {
        navContainer.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                localStorage.setItem(scrollKey, navContainer.scrollTop);
            }
        });
    }

    // Profile Logic
    const profileTrigger = document.getElementById('profileTrigger');
    const profileCard = document.getElementById('profileCard');

    if (profileTrigger) {
        profileTrigger.onclick = (e) => {
            e.stopPropagation();
            profileCard.classList.toggle('show');
        };
    }

    document.onclick = (e) => {
        if (profileCard && !profileCard.contains(e.target) && e.target !== profileTrigger) {
            profileCard.classList.remove('show');
        }
    };


})();