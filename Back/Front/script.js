// Login User
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  loginBtn.addEventListener('click', login);
}
async function login() {
    // Input Elements
    let usernameElement = document.getElementById('username-input');
    let passwordElement = document.getElementById('password-input');
    // Attempt Login
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: usernameElement.value,
            password: passwordElement.value
        })
    })
    const data = await res.json();
    // Output
    if (res.ok) {
        // redirect to profile page with URL parameter
        window.location.href = `view-profile.html`;
    } else {
        alert('Login failed');
    }
} 

// Register User
const registerBtn = document.getElementById('registerBtn');
if (registerBtn) {
  registerBtn.addEventListener('click', register);
}
async function register() {
    // Input Elements
    let usernameElement = document.getElementById('new-username-input');
    let passwordElement = document.getElementById('new-password-input');
    let emailElement = document.getElementById('new-email-input');
    // Check exisiting account
    const checkRes = await fetch('/api/register/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: usernameElement.value,
            email: emailElement.value
        })
    })
    const checkData = await checkRes.json();
    if (checkData === true) {
        alert('Register failed: Email or Username in use');
        return;
    }
    // Create account
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
    // Output
    if (res.ok) {
        // redirect to profile page with URL parameter
        window.location.href = `login.html`;
    } else {
        alert('Register failed');
    }
}

// View Profile
const profileViewBtn = document.getElementById('profileViewBtn');
if (profileViewBtn) {
  profileViewBtn.addEventListener('click', profileView);
}
async function profileView() {
    // Output Elements
    const emailElement = document.getElementById('username-output');
    const usernameElement = document.getElementById('email-output');
    const balanceElement = document.getElementById('balance-output');
    // Get user info
    const res = await fetch('/api/user', {
        credentials:'include'
    })
    const data = await res.json();
    // Output
    if (res.ok) {
        emailElement.innerText = data.email;
        usernameElement.innerText = data.username;
        balanceElement.innerText = '€' + data.balance;
    } else {
        alert('Login failed');
    }
}
// run automatically on the profile page
const usernameOutput = document.getElementById('username-output');
if (usernameOutput) {
  profileView();
}

// Create Post
const createPostBtn = document.getElementById('createPostBtn');
if (createPostBtn) {
  createPostBtn.addEventListener('click', createPost);
}
async function createPost() {
    // Input Elements
    const commentElement = document.getElementById('comment-input');
    // Get Parameters
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');
    // Create Post Call
    const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: userId,
            comment: commentElement.value
        })
    })
    // Output
    if (res.ok) {
        alert('Post Made!')
    } else {
        alert('Login failed');
    }
}

// Get all posts (Query)
const getPostsBtn = document.getElementById('getPostsBtn');
if (getPostsBtn) {
  getPostsBtn.addEventListener('click', getPosts);
}
async function getPosts() {
    // Input & Output Elements
    const searchElement = document.getElementById('search-input');
    const searchOutputElement = document.getElementById('search-output');
    // Get Search
    const res = await fetch('/api/posts?query=' + searchElement.value)
    const data = await res.json();
    // Output
    if (res.ok) {
        searchOutputElement.innerText = ``;
        if (data.length == 0) {
            searchOutputElement.innerText = `No Results for ${searchElement.value}`;
        }
        for (let i = 0; i < data.length; i++) {
            const a = document.createElement("li");
            a.innerText = `${data[i].comment}`;
            searchOutputElement.appendChild(a);
            }
    }
}

// Log User out (Clear Cookies)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
async function logout() {
    // Logout Call
    await fetch('/api/user/logout', {
        method: 'POST',
        credentials: 'include'
    });
    // Output - Redirect to login
    window.location.href = 'index.html';
}