// ==========================================
// 1. إدارة ظهور وإخفاء الـ Popups
// ==========================================
function openEditPopup() {
    const popup = document.getElementById("editProfilePopup");
    if (popup) popup.style.display = "flex";
}
function closeEditPopup() {
    const popup = document.getElementById("editProfilePopup");
    if (popup) popup.style.display = "none";
}
function openPopup() {
    const popup = document.getElementById("passwordPopup");
    if (popup) popup.style.display = "flex";
}
function closePopup() {
    const popup = document.getElementById("passwordPopup");
    if (popup) popup.style.display = "none";
    const form = document.getElementById("changePasswordForm");
    if (form) form.reset();
}

// ==========================================
// 2. إرسال وتحديث البيانات بالـ AJAX مع SweetAlert2
// ==========================================

// حفظ تعديلات البيانات الأساسية
function submitEditProfile() {
    const fullName = document.getElementById("inputFullName").value;
    const email = document.getElementById("inputEmail").value;

    if (!fullName || !email) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please fill in all fields.',
            confirmButtonColor: '#006d3d' // متناسق مع لون الثيم بتاعك
        });
        return;
    }

    const token = document.querySelector('#editProfileForm input[name="__RequestVerificationToken"]')?.value;

    // تعديل المسار ليكون صريحاً وشاملاً الـ Area والـ Controller والأكشن
    fetch('/Admin/AdminPanel/UploadProfilePicture', {
        method: 'POST',
        headers: {
            'RequestVerificationToken': token
        },
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById("displayFullName").innerText = fullName;
                document.getElementById("displayEmail").innerText = email;

                // الـ SweetAlert الرايق اللي طلبته للتعديل الناجح 🎉
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: data.message || 'Profile updated successfully 🎉',
                    timer: 2000,
                    showConfirmButton: false
                });

                closeEditPopup();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                    confirmButtonColor: '#ef4444'
                });
            }
        })
        .catch(err => {
            console.error("Error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Something went wrong while updating your profile.',
                confirmButtonColor: '#ef4444'
            });
        });
}

// تغيير كلمة المرور
function submitChangePassword() {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!oldPassword || !newPassword || !confirmPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please fill in all password fields.',
            confirmButtonColor: '#006d3d'
        });
        return;
    }

    if (newPassword !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Mismatch',
            text: 'New password and confirmation do not match!',
            confirmButtonColor: '#ef4444'
        });
        return;
    }

    const token = document.querySelector('#changePasswordForm input[name="__RequestVerificationToken"]')?.value;

    fetch(`/Admin/AdminPanel/ChangePassword?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`, {
        method: 'POST',
        headers: {
            'RequestVerificationToken': token
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Changed!',
                    text: data.message || 'Password changed successfully 🎉',
                    timer: 2000,
                    showConfirmButton: false
                });
                closePopup();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: data.message,
                    confirmButtonColor: '#ef4444'
                });
            }
        })
        .catch(err => {
            console.error("Error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Something went wrong while changing your password.',
                confirmButtonColor: '#ef4444'
            });
        });
}
// تشغيل الـ Input المخفي عند الضغط على حاوية الصورة
function triggerFileInput() {
    document.getElementById("profileImageInput").click();
}

// رفع الصورة فوراً عند اختيارها
function uploadProfilePicture() {
    const fileInput = document.getElementById("profileImageInput");
    const file = fileInput.files[0];

    if (!file) return;

    // تجهيز الملف لإرساله في الـ Request
    const formData = new FormData();
    formData.append("ProfilePictureFile", file);

    // الحصول على توكن الحماية لمنع الـ CSRF
    const token = document.querySelector('#editProfileForm input[name="__RequestVerificationToken"]')?.value;

    // إظهار مؤشر تحميل بسيط لليوزر
    Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while updating your profile picture.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch('/Admin/AdminPanel/UploadProfilePicture', {
        method: 'POST',
        headers: {
            'RequestVerificationToken': token // حماية الـ Identity
        },
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // تحديث الصورة في كافة أماكن الصفحة فوراً بدون ريفريش
                const topbarImg = document.getElementById("topbarAvatar");
                const cardImg = document.getElementById("profileCardAvatar");
                const placeholder = document.getElementById("avatarPlaceholderIcon");

                // لو كان عارض الأيقونة الافتراضية، نقوم بإنشاء عنصر الصورة وعرضه
                if (cardImg) {
                    cardImg.src = data.newImageUrl;
                } else if (placeholder) {
                    // تحويل الأيقونة لصورة حقيقية بعد الرفع بنجاح
                    location.reload(); // أسهل لضمان إعادة بناء عناصر الصور المرفوعة لأول مرة
                    return;
                }

                if (topbarImg) topbarImg.src = data.newImageUrl;

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Profile picture updated successfully 🎉',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: data.message,
                    confirmButtonColor: '#ef4444'
                });
            }
        })
        .catch(err => {
            console.error("Error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'An error occurred while uploading the image.',
                confirmButtonColor: '#ef4444'
            });
        });
}
// ميثود تسجيل الخروج الرايقة بالـ SweetAlert2
function handleLogout() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out of your session!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // أحمر للخروج
        cancelButtonColor: '#718096',
        confirmButtonText: 'Yes, Logout!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // عمل Submit للفورم المخفي اللي عملناه في الـ View
            document.getElementById("logoutForm").submit();
        }
    });
}