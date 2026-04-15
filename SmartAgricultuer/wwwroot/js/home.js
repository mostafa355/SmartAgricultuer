// اضغط زر Start Upload
document.getElementById('startUploadBtn').addEventListener('click', () => {
  alert('Navigate to Upload Page (like navigate("/upload") in React)');
});
// 1. تحميل الناف بار أولاً
fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav-placeholder').innerHTML = data;

        // 2. بعد ما الناف بار يحمل، نربط أزرار البروفايل
        setupProfileMenu();
        
        // 3. كود تحديد الرابط النشط
        highlightActiveLink();
    });

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

// زر الـ Start Upload
if(document.getElementById('startUploadBtn')){
    document.getElementById('startUploadBtn').addEventListener('click', () => {
        window.location.href = 'upload.html'; // بدلاً من الـ alert
    });
}