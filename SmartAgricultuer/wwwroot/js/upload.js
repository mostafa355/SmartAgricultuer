const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const filePreviewContainer = document.getElementById('filePreviewContainer');
const previewImage = document.getElementById('previewImage');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const warningMsg = document.getElementById('warningMsg');
const scanBtn = document.getElementById('scanBtn');

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

// في الأول disable كل حاجة
let typeSelected = false;
scanBtn.disabled = true;
browseBtn.disabled = true;
scanBtn.style.opacity = '0.5';
browseBtn.style.opacity = '0.5';

// دالة اختيار النوع
function selectType(type) {
    typeSelected = true;

    document.getElementById('isInsectInput').value = type === 'insect' ? 'true' : 'false';

    document.getElementById('plantBtn').classList.toggle('active', type === 'plant');
    document.getElementById('insectBtn').classList.toggle('active', type === 'insect');

    scanBtn.disabled = false;
    browseBtn.disabled = false;
    scanBtn.style.opacity = '1';
    browseBtn.style.opacity = '1';

    // إخفاء سلس
    warningMsg.style.opacity = '0';
    warningMsg.style.maxHeight = '0';
    warningMsg.style.marginTop = '0';
    warningMsg.style.marginBottom = '0';
    warningMsg.style.padding = '0';
    setTimeout(() => warningMsg.classList.add('hidden'), 400);
}

document.querySelector('form').addEventListener('submit', function (e) {
    if (!typeSelected) {
        e.preventDefault();
        warningMsg.classList.remove('hidden');
        setTimeout(() => {
            warningMsg.style.opacity = '1';
            warningMsg.style.maxHeight = '60px';
            warningMsg.style.marginTop = '16px';
            warningMsg.style.marginBottom = '16px';
            warningMsg.style.padding = '10px 16px';
        }, 10);
    }
});