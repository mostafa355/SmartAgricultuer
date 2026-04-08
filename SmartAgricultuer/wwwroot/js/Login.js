lucide.createIcons();

const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function togglePassword() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.setAttribute('data-lucide', 'eye');
    } else {
        passwordInput.type = 'password';
        eyeIcon.setAttribute('data-lucide', 'eye-off');
    }
    lucide.createIcons();
}

loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorMsg.textContent = "";

    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value.trim();

    if (!validateEmail(email)) {
        errorMsg.textContent = "Please enter a valid email address";
        return;
    }

    if (!/^[0-9]+$/.test(password)) {
        errorMsg.textContent = "Password must contain numbers only!";
        return;
    }

    if (password.length !== 9) {
        errorMsg.textContent = "Password must be exactly 9 digits";
        return;
    }

    try {
        const response = await fetch('https://localhost:7001/api/Account/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (data.token) {
            localStorage.setItem('userToken', data.token);
            alert("Login Successful!");
            window.location.href = "/dashboard";
        } else {
            errorMsg.textContent = data.message || "Invalid email or password";
        }
    } catch (err) {
        console.error("Login Error:", err);
        errorMsg.textContent = "Server error, please try again later";
    }
});