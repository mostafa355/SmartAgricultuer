document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirm = document.getElementById('confirm').value.trim();

    // Reset errors
    document.getElementById('error-name').textContent = '';
    document.getElementById('error-email').textContent = '';
    document.getElementById('error-password').textContent = '';
    document.getElementById('error-confirm').textContent = '';

    let hasError = false;

    // Validation
    if (!name.match(/^[A-Za-z\s]+$/)) {
        document.getElementById('error-name').textContent = "Name must contain letters only";
        hasError = true;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        document.getElementById('error-email').textContent = "Invalid email format";
        hasError = true;
    }
    if (!password.match(/^[0-9]{9}$/)) {
        document.getElementById('error-password').textContent = "Password must be exactly 9 digits";
        hasError = true;
    }
    if (password !== confirm) {
        document.getElementById('error-confirm').textContent = "Passwords do not match";
        hasError = true;
    }

    if (hasError) return;

    // Send POST request
    try {
        const response = await fetch("https://localhost:7001/api/Account/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ FullName: name, Email: email, Password: password })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Success! Your account has been created.");
            document.getElementById('registerForm').reset();
            window.location.href = "login.html";
        } else {
            alert(result.message || "Registration failed.");
        }

    } catch (err) {
        console.error(err);
        alert("Registration failed. Check console for details.");
    }
});