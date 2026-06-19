// Open the Edit Modal and populate existing data
window.openEditModal = function (type, currentValue) {
    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('modalTitle');
    const inputLabel = document.getElementById('inputLabel');
    const editType = document.getElementById('editType');
    const editValue = document.getElementById('editValue');

    // Set edit type based on which button was clicked
    editType.value = type;
    editValue.value = currentValue; // Set the current value into the input field

    if (type === 'name') {
        modalTitle.textContent = "Edit Your Name";
        inputLabel.textContent = "Full Name";
        editValue.type = "text";
    } else {
        modalTitle.textContent = "Edit Your Email";
        inputLabel.textContent = "Email Address";
        editValue.type = "email";
    }

    // Show the Modal
    modal.classList.remove('hidden');
}

// Close the Modal
window.closeModal = function () {
    document.getElementById('editModal').classList.add('hidden');
}

// Handle Form Submission for Updating Name/Email via Fetch API
document.getElementById('editForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const type = document.getElementById('editType').value;
    const value = document.getElementById('editValue').value;

    fetch('/UserPanel/UpdateProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Type: type, Value: value })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({ icon: 'success', title: 'Updated!', text: 'Saved successfully', timer: 1500, showConfirmButton: false })
                    .then(() => location.reload());
            } else {
                Swal.fire({ icon: 'error', title: 'Oops...', text: data.message });
            }
        });
});

// Handle Profile Picture Upload and Instant Preview
function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const profileImage = document.getElementById('profileImage');
    const placeholderIcon = document.getElementById('profileImagePlaceholder');
    const oldSrc = profileImage.src; // Save the old image path as a backup

    // 1. Instantly display temporary image preview and handle UI switching
    if (placeholderIcon) {
        placeholderIcon.style.display = 'none'; // Hide the default icon if it exists
    }
    profileImage.style.display = 'block'; // Make sure the img element is visible
    profileImage.src = URL.createObjectURL(file);

    // 2. Prepare form data to send to the server
    const formData = new FormData();
    formData.append("file", file); // Must match the parameter name (IFormFile file) in the Controller

    // 3. Send the image using Fetch API
    fetch('/UserPanel/UploadProfilePicture', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // 4. If successful, set the permanent image path returned from the server
                profileImage.src = data.imagePath;
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Profile picture updated successfully 🎉',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                // If failed, revert to the old state and display the error message
                if (placeholderIcon && (!oldSrc || oldSrc.endsWith('/') || oldSrc === window.location.href)) {
                    placeholderIcon.style.display = 'flex';
                    profileImage.style.display = 'none';
                } else {
                    profileImage.src = oldSrc;
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Revert UI on network failure
            if (placeholderIcon && (!oldSrc || oldSrc.endsWith('/') || oldSrc === window.location.href)) {
                placeholderIcon.style.display = 'flex';
                profileImage.style.display = 'none';
            } else {
                profileImage.src = oldSrc;
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while uploading the image. Please check the server connection.'
            });
        });
}