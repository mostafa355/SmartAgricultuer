
function setupProfileMenu() {
    const trigger = document.getElementById('profileTrigger');
    const card = document.getElementById('profileCard');

    if (trigger && card) {
        trigger.onclick = function(event) {
            event.stopPropagation();
            card.classList.toggle('show');
            console.log("Profile menu toggled!");
        };

        // إغلاق المنيو عند الضغط في أي مكان
        document.onclick = function(event) {
            if (!card.contains(event.target) && event.target !== trigger) {
                card.classList.remove('show');
            }
        };
    }
}

function highlightActiveLink() {
    const navItems = document.querySelectorAll('.nav-item');
    const currentUrl = window.location.href;
    navItems.forEach(item => {
        if (currentUrl.includes(item.getAttribute('href'))) {
            item.classList.add('active');
        }
    });
}
