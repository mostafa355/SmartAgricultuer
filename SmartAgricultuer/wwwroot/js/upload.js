const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const filePreviewContainer = document.getElementById('filePreviewContainer');
const previewImage = document.getElementById('previewImage');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const warningMsg = document.getElementById('warningMsg');
const scanBtn = document.getElementById('scanBtn');

let typeSelected = false;
let apiOnline = false; // ← متغير جديد

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

// إزالة الملف
removeFile.addEventListener('click', () => {
    fileInput.value = '';
    filePreviewContainer.classList.add('hidden');
});

// في الأول disable كل حاجة
scanBtn.disabled = true;
browseBtn.disabled = true;
scanBtn.style.opacity = '0.5';
browseBtn.style.opacity = '0.5';

// دالة اختيار النوع
function selectType(type) {
    // لو الـ API مش شغال، ميسمحش باختيار
    if (!apiOnline) return;

    typeSelected = true;

    document.getElementById('isInsectInput').value = type === 'insect' ? 'true' : 'false';
    document.getElementById('plantBtn').classList.toggle('active', type === 'plant');
    document.getElementById('insectBtn').classList.toggle('active', type === 'insect');

    scanBtn.disabled = false;
    browseBtn.disabled = false;
    scanBtn.style.opacity = '1';
    browseBtn.style.opacity = '1';

    warningMsg.style.opacity = '0';
    warningMsg.style.maxHeight = '0';
    warningMsg.style.marginTop = '0';
    warningMsg.style.marginBottom = '0';
    warningMsg.style.padding = '0';
    setTimeout(() => warningMsg.classList.add('hidden'), 400);
}

document.querySelector('form').addEventListener('submit', function (e) {
    if (!apiOnline) {
        e.preventDefault();
        return;
    }
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

async function checkApiStatus() {
    const apiMsg = document.getElementById('apiWarningMsg');

    try {
        const response = await fetch('/UserPanel/CheckApiStatus');
        const data = await response.json();

        if (data.online) {
            apiOnline = true;
            if (apiMsg) apiMsg.classList.add('hidden');
        } else {
            showApiOffline();
        }
    } catch (error) {
        console.error("API Status Check Failed:", error);
        showApiOffline();
    }
}

function showApiOffline() {
    apiOnline = false;
    typeSelected = false; 

    const apiMsg = document.getElementById('apiWarningMsg');
    if (apiMsg) {
        apiMsg.classList.remove('hidden');
        apiMsg.textContent = "⚠️ AI Server is temporarily offline. Please try again later.";
    }

    scanBtn.disabled = true;
    browseBtn.disabled = true;
    scanBtn.style.opacity = '0.5';
    browseBtn.style.opacity = '0.5';

    document.getElementById('plantBtn').classList.remove('active');
    document.getElementById('insectBtn').classList.remove('active');
}

checkApiStatus();
