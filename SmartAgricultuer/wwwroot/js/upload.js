const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const filePreviewContainer = document.getElementById('filePreviewContainer');
const previewImage = document.getElementById('previewImage');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const warningMsg = document.getElementById('warningMsg');
const scanBtn = document.getElementById('scanBtn');

// الـ Loaders
const fullScreenLoader = document.getElementById('fullScreenLoader');
const connectingLoader = document.getElementById('connectingLoader');
const connectionFailedMsg = document.getElementById('connectionFailedMsg');

const uploadForm = document.querySelector('form');
let typeSelected = false;
let apiOnline = false;
let isSubmitting = false;

// فتح نافذة اختيار الملفات
browseBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    previewImage.src = URL.createObjectURL(file);
    fileName.textContent = file.name;
    filePreviewContainer.classList.remove('hidden');
});

removeFile.addEventListener('click', () => {
    fileInput.value = '';
    filePreviewContainer.classList.add('hidden');
});

// حالة البداية
scanBtn.disabled = true;
browseBtn.disabled = true;
scanBtn.style.opacity = '0.5';
browseBtn.style.opacity = '0.5';

function selectType(type) {
    if (!apiOnline) return;

    typeSelected = true;
    document.getElementById('isInsectInput').value = type === 'insect' ? 'true' : 'false';
    document.getElementById('plantBtn').classList.toggle('active', type === 'plant');
    document.getElementById('insectBtn').classList.toggle('active', type === 'insect');

    scanBtn.disabled = false;
    browseBtn.disabled = false;
    scanBtn.style.opacity = '1';
    browseBtn.style.opacity = '1';

    warningMsg.classList.add('hidden');
}

uploadForm.addEventListener('submit', function (e) {
    if (isSubmitting || !apiOnline) {
        e.preventDefault();
        return;
    }

    if (!typeSelected) {
        e.preventDefault();
        warningMsg.classList.remove('hidden');
        return;
    }

    // تفعيل التحميل
    isSubmitting = true;
    scanBtn.textContent = "Analyzing...";

    // إظهار الـ Loader اللي بيغطي الشاشة
    if (fullScreenLoader) {
        fullScreenLoader.classList.remove('hidden');
    }
});
// دالة إغلاق الـ Modal الخاص بالخطأ
function closeErrorModal() {
    const errorModal = document.getElementById('errorModal');
    if (errorModal) {
        errorModal.classList.add('hidden');
    }
}
async function checkApiStatus() {
    try {
        const response = await fetch('/UserPanel/CheckApiStatus');
        const data = await response.json();

        if (data.online) {
            apiOnline = true;
            connectingLoader.classList.add('hidden'); // إخفاء لودر الاتصال
        } else {
            showConnectionFailed();
        }
    } catch (error) {
        showConnectionFailed();
    }
}

function showConnectionFailed() {
    apiOnline = false;
    connectingLoader.classList.add('hidden');
    connectionFailedMsg.classList.remove('hidden');
    scanBtn.disabled = true;
    browseBtn.disabled = true;
    scanBtn.style.opacity = '0.5';
    browseBtn.style.opacity = '0.5';
}

checkApiStatus();