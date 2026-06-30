document.addEventListener('DOMContentLoaded', () => {
    // Get all DOM elements safely
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const uploadContent = document.getElementById('uploadContent');
    const plantInput = document.getElementById('plantInput');
    const tagContainer = document.getElementById('tagContainer');
    const insectForm = document.getElementById('insectForm');
    const affectedPlantsSection = document.getElementById('affectedPlantsSection');
    const autocompleteList = document.getElementById('autocompleteList');
    const damageDescSection = document.getElementById('damageDescSection');
    const saveBtn = document.getElementById('saveBtn');

    // Click on drop zone triggers file input
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
    }

    // Handle file selection and preview
    if (fileInput && imagePreview) {
        fileInput.onchange = function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    imagePreview.classList.remove('hidden');
                    if (uploadContent) uploadContent.classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // Function to add a plant tag
    function addTag(value) {
        if (!plantInput || !tagContainer || !autocompleteList) return;
        const val = value.trim();
        if (val !== '') {
            let exists = false;
            document.querySelectorAll('#tagContainer .tag').forEach(tag => {
                if (tag.textContent.replace('×', '').replace('close', '').trim().toLowerCase() === val.toLowerCase()) {
                    exists = true;
                }
            });

            if (!exists) {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.innerHTML = `${val} <span class="material-symbols-outlined remove-tag">close</span>`;
                tag.querySelector('.remove-tag').onclick = () => tag.remove();
                tagContainer.insertBefore(tag, plantInput);
            }
            plantInput.value = '';
            autocompleteList.classList.add('hidden');
        }
    }

    // تفعيل زر الحذف للتاجات المحملة مسبقاً
    document.querySelectorAll('#tagContainer .tag .remove-tag').forEach(btn => {
        btn.onclick = () => btn.parentElement.remove();
    });

    // Add tag when Enter key is pressed
    if (plantInput) {
        plantInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag(plantInput.value);
            }
        });
    }

    // Autocomplete functionality
    if (plantInput && autocompleteList) {
        plantInput.addEventListener('input', () => {
            const query = plantInput.value.trim();
            if (query.length < 1) {
                autocompleteList.classList.add('hidden');
                return;
            }

            fetch(`/Admin/AdminPanel/GetPlantsAutocomplete?term=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    autocompleteList.innerHTML = '';
                    if (data.length > 0) {
                        data.forEach(plantName => {
                            const item = document.createElement('div');
                            item.className = 'autocomplete-suggestion';
                            item.textContent = plantName;
                            item.addEventListener('click', () => {
                                addTag(plantName);
                            });
                            autocompleteList.appendChild(item);
                        });
                        autocompleteList.classList.remove('hidden');
                    } else {
                        autocompleteList.classList.add('hidden');
                    }
                })
                .catch(error => {
                    console.error('Error fetching autocomplete:', error);
                    autocompleteList.classList.add('hidden');
                });
        });
    }

    // Hide autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        if (autocompleteList && plantInput) {
            if (e.target !== plantInput && e.target !== autocompleteList && !autocompleteList.contains(e.target)) {
                autocompleteList.classList.add('hidden');
            }
        }
    });

    // Function to toggle sections based on status
    function toggleSectionsBasedOnStatus(selectedValue) {
        if (selectedValue === 'Harmful') {
            if (affectedPlantsSection) affectedPlantsSection.classList.remove('hidden');
            if (damageDescSection) damageDescSection.classList.remove('hidden');
        } else if (selectedValue === 'Beneficial') {
            if (affectedPlantsSection) affectedPlantsSection.classList.add('hidden');
            if (damageDescSection) {
                damageDescSection.classList.add('hidden');
                const damageDesc = document.getElementById('damageDesc');
                if (damageDesc) damageDesc.value = '';
            }
            document.querySelectorAll('#tagContainer .tag').forEach(t => t.remove());
        }
    }

    document.querySelectorAll('input[name="status"], input[name="Status"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            toggleSectionsBasedOnStatus(e.target.value);
        });
    });

    const currentSelectedStatus = document.querySelector('input[name="Status"]:checked') ||
        document.querySelector('input[name="status"]:checked');
    if (currentSelectedStatus) {
        toggleSectionsBasedOnStatus(currentSelectedStatus.value);
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Discard all changes?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, discard changes!'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/Admin/AdminPanel/Insects';
                }
            });
        };
    }

    // --- حدث الحفظ المستقل والأكيد ---
    if (saveBtn) {
        saveBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const statusChecked = document.querySelector('input[name="Status"]:checked') ||
                document.querySelector('input[name="status"]:checked');
            const currentStatus = statusChecked ? statusChecked.value : "";

            const plantTags = [];
            if (currentStatus === 'Harmful') {
                document.querySelectorAll('#tagContainer .tag').forEach(tag => {
                    let name = tag.textContent.replace('×', '').replace('close', '').trim();
                    if (name) plantTags.push(name);
                });
            }

            let base64Image = "";
            if (imagePreview && !imagePreview.classList.contains('hidden') && imagePreview.src.startsWith('data:')) {
                base64Image = imagePreview.src;
            }

            const insectId = document.querySelector('input[name="Id"]')?.value || '';

            const formData = new URLSearchParams();
            if (insectId) {
                formData.append("Id", insectId);
            }

            formData.append("Name", (document.getElementById("insectName")?.value || "").trim());
            formData.append("ScientificName", (document.getElementById("sciName")?.value || "").trim());
            formData.append("Status", currentStatus);
            formData.append("DamageDescription", (document.getElementById("damageDesc")?.value || "").trim());
            formData.append("PreventionMethod", (document.getElementById("prevention")?.value || "").trim());
            formData.append("ImageBase64", base64Image);

            plantTags.forEach((tag) => {
                formData.append("AffectedPlants", tag);
            });

            const url = '/Admin/AdminPanel/Edit_Insect';
            const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value || '';

            Swal.fire({
                title: 'Saving...',
                text: 'Please wait while we save your data.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'RequestVerificationToken': token
                },
                body: formData.toString()
            })
                .then(response => response.json())
                .then(data => {
                    Swal.close();
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: data.message || 'Insect updated successfully!',
                            confirmButtonColor: '#006d3d'
                        }).then(() => {
                            window.location.href = '/Admin/AdminPanel/Insects';
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: data.message || 'Error while saving data.',
                            confirmButtonColor: '#3085d6'
                        });
                    }
                })
                .catch(error => {
                    Swal.close();
                    console.error('Error details:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'An unexpected error occurred.',
                        confirmButtonColor: '#3085d6'
                    });
                });
        });
    }
});