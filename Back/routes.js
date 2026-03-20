const express = require('express');
const router = express.Router();
const argon2 = require("argon2");
const dal = require('./dal');

// Register
router.post('/register', async (req, res) => {
    // Hash Password
    const passwordHash = await argon2.hash(req.body.password, {
        type: argon2.argon2id
    });
    // Create User in DB
    let response = await dal.createUser(req.body.username, passwordHash, req.body.email);
    // Output
    if (response) {
        res.json(response);
    } else {
        res.status(401).json({error:"Invalid input"});
    }
    });

// Register - Check if user exists
router.post('/register/check', async (req, res) => {
    // Check if account exists in DB
    let response = await dal.checkAccount(req.body.email, req.body.username);
    // Output
    if (response == true | response == false) {
        res.json(response);
    } else {
        res.status(401).json({error:"Invalid input"});
    }
});

// Login
router.post('/login', async (req, res) => {
    // Find user by username in DB
    let user = await dal.findUser(req.body.username)
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Check password validity 
    const isValid = await argon2.verify(user.password, req.body.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Create new login session
    const sessionId = await dal.logSession(user.id);
    res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: 'lax'
    });
    res.json(user);
});

// Post Comment
router.post('/posts', async (req, res) => {
    // Create new post in DB
    let post = await dal.createPost(req.body.username, req.body.comment)
    // Output
    if (post) {
        res.json(post);
    } else {
        res.status(401).json({error:"Invalid credentials"});
    }
});

router.get('/posts', async (req, res) => {
    // Get Posts in DB
    const posts = await dal.getPosts(req.query.query)
    // Output
    res.json(posts);
});

// Get user by ID
router.get('/user', async (req, res) => {
    // Get Session From DB
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    const session = await dal.getSession(sessionId);
    // Check session validity
    if (!session) {
        return res.status(401).json({ error: 'Invalid session' });
    }
    if (session.expiresAt < Math.floor(Date.now() / 1000)) {
        return res.status(401).json({ error: 'Session expired' });
    }
    // Get User from DB after successful check
    const user = await dal.getUserById(session.userId)
    // Output
    res.json(user);
});

// Logout
router.post('/user/logout', async (req, res) => {
    // Clear cookies
    res.clearCookie('sessionId', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false // true in production
    });
    // Output
    res.json({ success: true });
});

module.exports = router;
