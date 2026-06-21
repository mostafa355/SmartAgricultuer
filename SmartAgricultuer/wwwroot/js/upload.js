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

// استبدل الـ uploadForm.addEventListener('submit', ...) بهذا الكود
uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // منع الإرسال التلقائي للفورم

    if (isSubmitting || !apiOnline) return;
    if (!typeSelected) {
        warningMsg.classList.remove('hidden');
        return;
    }

    isSubmitting = true;
    scanBtn.disabled = true;
    scanBtn.innerHTML = `<span class="material-symbols-outlined rotating">analytics</span> Analyzing...`;
    fullScreenLoader.classList.remove('hidden');

    const formData = new FormData(this);

    try {
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            window.location.href = response.url;
        } else {
            fullScreenLoader.classList.add('hidden');
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to process image.' });
            isSubmitting = false;
        }
    } catch (err) {
        fullScreenLoader.classList.add('hidden');
        console.error(err);
        alert("Connection error occurred.");
    }
});

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
            connectingLoader.classList.add('hidden'); 
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