document.addEventListener('DOMContentLoaded', () => {
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

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.onchange = function () {
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

    function addTag(value) {
        const val = value.trim();
        if (val !== '') {
            let exists = false;
            document.querySelectorAll('#tagContainer .tag').forEach(tag => {
                if (tag.textContent.replace('close', '').trim().toLowerCase() === val.toLowerCase()) {
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

    plantInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(plantInput.value);
        }
    });

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
            });
    });

    document.addEventListener('click', (e) => {
        if (e.target !== plantInput && e.target !== autocompleteList) {
            autocompleteList.classList.add('hidden');
        }
    });

    document.querySelectorAll('input[name="status"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Harmful') {
                affectedPlantsSection.classList.remove('hidden');
                if (damageDescSection) damageDescSection.classList.remove('hidden');
            } else {
                affectedPlantsSection.classList.add('hidden');
                if (damageDescSection) {
                    damageDescSection.classList.add('hidden');
                    document.getElementById('damageDesc').value = '';
                }
                document.querySelectorAll('#tagContainer .tag').forEach(t => t.remove());
            }
        });
    });

    document.querySelectorAll('.remove-tag').forEach(btn => {
        btn.onclick = (e) => e.target.parentElement.remove();
    });

    insectForm.onsubmit = (e) => {
        e.preventDefault();

        const statusChecked = document.querySelector('input[name="status"]:checked');
        const currentStatus = statusChecked ? statusChecked.value : "";

        const tags = [];
        if (currentStatus === 'Harmful') {
            document.querySelectorAll('#tagContainer .tag').forEach(tag => {
                const plantName = tag.textContent.replace('close', '').trim();
                if (plantName) tags.push(plantName);
            });
        }

        let base64String = "";
        if (!imagePreview.classList.contains('hidden') && imagePreview.src.startsWith('data:')) {
            base64String = imagePreview.src;
        }

        // استخدام URLSearchParams لتهيئة البيانات كـ Form-UrlEncoded القياسي لـ MVC
        const formData = new URLSearchParams();
        formData.append("Name", (document.getElementById("insectName").value || "").trim());
        formData.append("ScientificName", (document.getElementById("sciName").value || "").trim());
        formData.append("DamageDescription", (document.getElementById("damageDesc").value || "").trim());
        formData.append("PreventionMethod", (document.getElementById("prevention").value || "").trim());
        formData.append("Status", currentStatus);
        formData.append("ImageBase64", base64String);

        // إرسال المصفوفة بشكل يفهمه الـ Model Binder للـ List<string>
        tags.forEach((tag, index) => {
            formData.append(`AffectedPlants[${index}]`, tag);
        });

        fetch('/Admin/AdminPanel/Add_Insects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // التعديل السحري هنا
            },
            body: formData.toString()
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Insect data saved successfully! 🎉',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.reload();
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
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Connection Error',
                    text: 'An unexpected error occurred while connecting to the server.',
                    confirmButtonColor: '#3085d6'
                });
            });
    };

    document.getElementById('cancelBtn').onclick = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Discard all entered data?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, discard it!'
        }).then((result) => {
            if (result.isConfirmed) {
                insectForm.reset();
                imagePreview.classList.add('hidden');
                imagePreview.src = '';
                uploadContent.classList.remove('hidden');
                document.querySelectorAll('.tag').forEach(t => t.remove());
                affectedPlantsSection.classList.remove('hidden');
                if (damageDescSection) damageDescSection.classList.remove('hidden');
            }
        });
    };
});
document.getElementById('insectForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // تجميع أسماء النباتات من الـ Tags الموجودة جوه الـ container
    // افترضت هنا إن الـ Tags عندك جواها span أو element واخد class اسمه 'tag-text' أو بناخدهم من الـ text مباشرة
    const plantTags = [];
    document.querySelectorAll('#tagContainer .tag').forEach(tag => {
        // بنشيل أي مساحات أو علامة الحذف (x) لو موجودة جوه الـ Tag
        const name = tag.textContent.replace('×', '').trim();
        if (name) plantTags.push(name);
    });

    // تحويل الصورة المرفوعة لـ Base64 لو تم تغييرها
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    let base64Image = null;

    if (fileInput.files.length > 0) {
        base64Image = imagePreview.src; // الـ src هنا هيكون base64 ناتج عن الـ FileReader الفعلي
    }

    // بناء الـ Object المطابق للـ ViewModel
    const formData = {
        Id: document.querySelector('input[name="Id"]').value,
        Name: document.getElementById('insectName').value,
        ScientificName: document.getElementById('sciName').value,
        Status: document.querySelector('input[name="Status"]:checked').value,
        AffectedPlants: plantTags,
        DamageDescription: document.getElementById('damageDesc').value,
        PreventionMethod: document.getElementById('prevention').value,
        ImageBase64: base64Image
    };

    // إرسال البيانات بالـ Fetch
    fetch('/Admin/AdminPanel/Edit_Insect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // لو بتستخدم Antiforgery Token من الـ HTML
            'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Insect updated successfully.',
                    confirmButtonColor: '#006d3d'
                }).then(() => {
                    window.location.href = '/Admin/AdminPanel/Insects';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message || 'Something went wrong!',
                    confirmButtonColor: '#006d3d'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unexpected error occurred.',
                confirmButtonColor: '#006d3d'
            });
        });
});