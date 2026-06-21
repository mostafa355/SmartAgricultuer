document.getElementById('passwordForm').onsubmit = async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const currentPass = document.getElementById('currentPass').value;
    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;

    // 1. Basic Validation
    if (newPass !== confirmPass) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'New passwords do not match!',
            confirmButtonColor: '#e53e3e'
        });
        return;
    }

    if (currentPass === newPass) {
        Swal.fire({
            icon: 'warning',
            title: 'Wait',
            text: 'New password must be different from the current one!',
            confirmButtonColor: '#38b2ac'
        });
        return;
    }

    // 2. Loading State
    submitBtn.disabled = true;
    submitBtn.textContent = "Updating...";

    // --- هنا التعديل اللي سألت عليه ---
    // سحب التوكين من الـ Hidden Input اللي الـ AntiForgeryToken ضافه
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

    try {
        const response = await fetch('/UserPanel/newpassword', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'RequestVerificationToken': token // التوكين بيبعت هنا
            },
            body: new URLSearchParams({
                currentPassword: currentPass,
                newPassword: newPass,
                confirmPassword: confirmPass
            })
        });

        const result = await response.json();

        // 3. Handle Response
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Password updated successfully! 🎉',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = '/UserPanel/Profile';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: result.message || 'An error occurred while updating the password.',
                confirmButtonColor: '#e53e3e'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Connection Error',
            text: 'Unable to connect to the server. Please try again later.',
            confirmButtonColor: '#e53e3e'
        });
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Update Password";
    }
};