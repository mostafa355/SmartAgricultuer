document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const form = document.getElementById('diseaseForm');

    let currentImageUrl = null;

    const displayFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (PNG, JPG, JPEG).');
            return;
        }

        const existingPreview = document.querySelector('.file-preview');
        if (existingPreview) {
            const oldImg = existingPreview.querySelector('.file-thumb');
            if (oldImg) URL.revokeObjectURL(oldImg.src);
            existingPreview.remove();
        }

        if (currentImageUrl) {
            URL.revokeObjectURL(currentImageUrl);
        }

        const previewContainer = document.createElement('div');
        previewContainer.className = 'file-preview';

        const imageUrl = URL.createObjectURL(file);
        currentImageUrl = imageUrl;

        previewContainer.innerHTML = `
            <div class="file-info">
                <img src="${imageUrl}" class="file-thumb" alt="Preview" />
                <span class="file-name">${file.name} ( ${(file.size / 1024).toFixed(1)} KB )</span>
            </div>
            <i class="fa-solid fa-trash-can delete-icon"></i>
        `;

        uploadArea.after(previewContainer);

        const removeFile = () => {
            previewContainer.remove();
            fileInput.value = '';
            URL.revokeObjectURL(imageUrl);
            currentImageUrl = null;
        };

        previewContainer.querySelector('.delete-icon').addEventListener('click', removeFile);
    };

    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            displayFile(e.target.files[0]);
        }
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    uploadArea.addEventListener('dragover', () => {
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        uploadArea.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const dt = new DataTransfer();
            dt.items.add(files[0]);
            fileInput.files = dt.files;
            displayFile(files[0]);
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        if (fileInput.files[0]) {
            formData.append('image', fileInput.files[0]);
        }

        const saveBtn = form.querySelector('.btn-save');
        saveBtn.disabled = true;

        console.log('Saving disease data...');
        alert('Disease entry saved successfully!');

        saveBtn.disabled = false;
    });

    const cancelBtn = document.querySelector('.btn-cancel');

    cancelBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            form.reset();
            document.querySelector('.file-preview')?.remove();

            if (currentImageUrl) {
                URL.revokeObjectURL(currentImageUrl);
                currentImageUrl = null;
            }
        }
    });
});