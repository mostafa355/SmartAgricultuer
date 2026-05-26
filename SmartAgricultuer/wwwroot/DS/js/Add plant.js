document.addEventListener('DOMContentLoaded', () => {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const tagsContainer = document.getElementById('tagsContainer');
    const tagInnerInput = document.querySelector('.tag-inner-input');
    const form = document.getElementById('plantForm');

    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        const existingPreview = document.querySelector('.file-preview-row');
        if (existingPreview) existingPreview.remove();

        const previewRow = document.createElement('div');
        previewRow.className = 'file-preview-row';
        const imageUrl = URL.createObjectURL(file);

        previewRow.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${imageUrl}" class="file-thumb">
                <span style="font-size: 14px; font-weight: 500;">${file.name}</span>
            </div>
            <span class="material-symbols-outlined delete-icon">delete</span>
        `;

        uploadZone.after(previewRow);

        previewRow.querySelector('.delete-icon').addEventListener('click', () => {
            previewRow.remove();
            fileInput.value = '';
        });
    };

    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFile(e.target.files[0]);
    });

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.backgroundColor = '#ecfdf5';
    });
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.backgroundColor = '#f0fdf4';
    });
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.backgroundColor = '#f0fdf4';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFile(files[0]);
        }
    });

    tagInnerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && tagInnerInput.value.trim() !== '') {
            e.preventDefault();
            const tagText = tagInnerInput.value.trim();
            const newTag = document.createElement('span');
            newTag.className = 'tag';
            newTag.innerHTML = `${tagText} <button type="button"><span class="material-symbols-outlined" style="font-size:16px">close</span></button>`;
            tagsContainer.insertBefore(newTag, tagInnerInput);
            tagInnerInput.value = '';

            newTag.querySelector('button').addEventListener('click', () => newTag.remove());
        }
    });

    document.querySelectorAll('.tag button').forEach(btn => {
        btn.addEventListener('click', () => btn.parentElement.remove());
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Plant data saved successfully!');
    });
});