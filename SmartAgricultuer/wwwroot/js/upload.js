const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const filePreviewContainer = document.getElementById('filePreviewContainer');
const previewImage = document.getElementById('previewImage');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');

// فتح نافذة اختيار الملفات
browseBtn.addEventListener('click', () => fileInput.click());

// عرض المعاينة عند اختيار ملف
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    previewImage.src = URL.createObjectURL(file);
    fileName.textContent = file.name;
    filePreviewContainer.classList.remove('hidden');
});

// إزالة الملف وتصفير الـ input
removeFile.addEventListener('click', () => {
    fileInput.value = '';
    filePreviewContainer.classList.add('hidden');
});