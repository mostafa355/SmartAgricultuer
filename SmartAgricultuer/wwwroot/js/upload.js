const fileInput = document.getElementById('fileInput');
const uploadIcon = document.getElementById('uploadIcon');
const browseBtn = document.getElementById('browseBtn');
const filePreviewContainer = document.getElementById('filePreviewContainer');
const previewImage = document.getElementById('previewImage');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const scanBtn = document.getElementById('scanBtn');
const result = document.getElementById('result');

// زر Browse فقط هو المسؤول عن فتح نافذة اختيار الملفات
browseBtn.addEventListener('click', () => fileInput.click());

// معالجة اختيار الملف وعرض المعاينة
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  previewImage.src = URL.createObjectURL(file);
  fileName.textContent = file.name;
  filePreviewContainer.classList.remove('hidden');
  result.textContent = '';
});

// إزالة الملف المختار
removeFile.addEventListener('click', () => {
  fileInput.value = '';
  filePreviewContainer.classList.add('hidden');
  result.textContent = '';
});

// محاكاة عملية الفحص (Scan)
scanBtn.addEventListener('click', () => {
  if (!fileInput.files[0]) {
    alert('Please upload an image first!');
    return;
  }

  result.textContent = 'Scanning...';
  setTimeout(() => {
    // استخدم backticks هنا
    result.textContent = `Scan complete for: ${fileInput.files[0].name}. Plant looks healthy! 🌱`;
  }, 2000); 
});