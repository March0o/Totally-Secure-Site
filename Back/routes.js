const express = require('express');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    const user = new User({ username, password, email });
    await user.save();

    res.send("User registered");
});

// Login (vulnerable to injection)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({
        username: username,
        password: password
    });

    if (user) {
        res.json(user); // ⚠️ returns full user object
    } else {
        res.status(401).send("Invalid credentials");
    }
});

// Get user by ID (IDOR vulnerability)
router.get('/user', async (req, res) => {
    const id = req.query.id;

    const user = await User.findById(id);
    res.json(user); // ⚠️ no auth check
});

module.exports = router;