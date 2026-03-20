const express = require('express');
const router = express.Router();
const argon2 = require("argon2");
const dal = require('./dal');

// Register
router.post('/register', async (req, res) => {
    console.log(req.body);
    const passwordHash = await argon2.hash(req.body.password, {
        type: argon2.argon2id
    });
    let response = await dal.createUser(req.body.username, passwordHash, req.body.email);
    console.log(response);
    if (response) {
        res.json(response);
    } else {
        res.status(401).json({error:"Invalid input"});
    }
    });

router.post('/register/check', async (req, res) => {
    console.log(req.body);
    let response = await dal.checkAccount(req.body.email, req.body.username);
    console.log(response);
    if (response == true | response == false) {
        res.json(response);
    } else {
        res.status(401).json({error:"Invalid input"});
    }
});

// Login
router.post('/login', async (req, res) => {
    let user = await dal.findUser(req.body.username)
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isValid = await argon2.verify(user.password, req.body.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
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
    console.log(req.body);
    let post = await dal.createPost(req.body.username, req.body.comment)

    if (post) {
        res.json(post);
    } else {
        res.status(401).json({error:"Invalid credentials"});
    }
});

router.get('/posts', async (req, res) => {
    const query = req.query.query;
    const posts = await dal.getPosts(query)
    res.json(posts);
});

// Get user by ID
router.get('/user', async (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const session = await dal.getSession(sessionId);

    if (!session) {
        return res.status(401).json({ error: 'Invalid session' });
    }

    if (session.expiresAt < Math.floor(Date.now() / 1000)) {
        return res.status(401).json({ error: 'Session expired' });
    }

    const user = await dal.getUserById(session.userId)
    res.json(user);
});

// Logout
router.post('/user/logout', async (req, res) => {
    res.clearCookie('sessionId', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false // true in production
    });
    res.json({ success: true });
});

module.exports = router;
