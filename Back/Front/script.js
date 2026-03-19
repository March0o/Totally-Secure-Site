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
        window.location.href = `view-profile.html?id=${data.id}`;
    } else {
        alert('Login failed');
    }
} 

async function register() {
    let usernameElement = document.getElementById('new-username-input');
    let passwordElement = document.getElementById('new-password-input');
    let emailElement = document.getElementById('new-email-input');

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: usernameElement.value,
            password: passwordElement.value,
            email: emailElement.value
        })
    })

    const data = await res.json();
    if (res.ok) {
        // redirect to profile page with URL parameter
        window.location.href = `view-profile.html?id=${data.id}`;
    } else {
        alert('Login failed');
    }
}

async function profileView() {
    const emailElement = document.getElementById('username-output');
    const usernameElement = document.getElementById('email-output');
    const balanceElement = document.getElementById('balance-output');

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    const res = await fetch('/api/user?id=' + userId)

    const data = await res.json();
    console.log(data)
    if (res.ok) {
        emailElement.innerText = data.email;
        usernameElement.innerText = data.username;
        balanceElement.innerText = '€' + data.balance;
    } else {
        alert('Login failed');
    }
}

async function createPost() {
    const commentElement = document.getElementById('comment-input');

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: userId,
            comment: commentElement.value
        })
    })
    if (res.ok) {
        alert('Post Made!')
    } else {
        alert('Login failed');
    }
}

async function getPosts() {
    const searchElement = document.getElementById('search-input');
    const searchOutputElement = document.getElementById('search-output');

    const res = await fetch('/api/posts?query=' + searchElement.value)
    const data = await res.json();

    console.log(data);
    if (res.ok) {
        searchOutputElement.innerHTML = ``;
        for (let i = 0; i < data.length; i++) {
            const a = document.createElement("li");
            a.innerHTML = `<p>${data[i].comment}</p>`;
            searchOutputElement.appendChild(a);
            }
    }
    else {
        alert('Login failed');
    }
}