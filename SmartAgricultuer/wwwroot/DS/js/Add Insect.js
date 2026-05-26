document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const uploadContent = document.getElementById('uploadContent');
    const plantInput = document.getElementById('plantInput');
    const tagContainer = document.getElementById('tagContainer');
    const insectForm = document.getElementById('insectForm');

  
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.onchange = function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('hidden');
                uploadContent.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    };

   
    plantInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && plantInput.value.trim() !== '') {
            e.preventDefault();
            const val = plantInput.value.trim();
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `${val} <span class="material-symbols-outlined remove-tag">close</span>`;
            tag.querySelector('.remove-tag').onclick = () => tag.remove();
            tagContainer.insertBefore(tag, plantInput);
            plantInput.value = '';
        }
    });


    document.querySelectorAll('.remove-tag').forEach(btn => {
        btn.onclick = (e) => e.target.parentElement.remove();
    });

   
    insectForm.onsubmit = (e) => {
        e.preventDefault();
        alert('Insect data has been registered successfully!');
       
    };

   
    document.getElementById('cancelBtn').onclick = () => {
        if(confirm('Discard all entered data?')) {
            insectForm.reset();
            imagePreview.classList.add('hidden');
            uploadContent.classList.remove('hidden');
            document.querySelectorAll('.tag').forEach(t => t.remove());
        }
    };
});