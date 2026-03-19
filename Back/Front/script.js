async function login() {
    let usernameElement = document.getElementById('username-input');
    let passwordElement = document.getElementById('password-input');

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: usernameElement.value,
            password: passwordElement.value
        })
    })

    const data = await res.json();
    if (res.ok) {
        // redirect to profile page with URL parameter
        window.location.href = `profile.html?id=${data.id}`;
    } else {
        alert('Login failed');
    }
} 