// 1. تحميل الناف بار
fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav-placeholder').innerHTML = data;
        // استدعاء دالة تشغيل منيو البروفايل (لو محتاجاها هنا)
    });

// 2. معالجة الفورم
document.getElementById('passwordForm').onsubmit = function(e) {
    e.preventDefault();

    const currentPass = document.getElementById('currentPass').value;
    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;

    // التأكد من تطابق كلمة المرور الجديدة
    if (newPass !== confirmPass) {
        alert("كلمتا المرور الجديدتان غير متطابقتين!");
        return;
    }

    // التأكد من أن كلمة المرور الجديدة ليست نفس القديمة
    if (currentPass === newPass) {
        alert("كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية!");
        return;
    }

    // لو كل شيء تمام
    alert("جاري تحديث كلمة المرور...");
    // هنا تقدري تبعتي البيانات للسيرفر (API)
    console.log("Success: Password updated.");
};