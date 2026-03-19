const express = require('express');
const router = express.Router();
const dal = require('./dal');

// Register
router.post('/register', async (req, res) => {
    console.log(req.body);
    let response = await dal.createUser(req.body.username, req.body.password, req.body.email);
    console.log(response);
    if (response) {
        res.json(response);
    } else {
        res.status(401).json({error:"Invalid input"});
    }
    });

// Login (vulnerable to injection)
router.post('/login', async (req, res) => {
    console.log(req.body);
    let user = await dal.findUser(req.body.username, req.body.password)

    if (user) {
        res.json(user); // ⚠️ returns full user object
    } else {
        res.status(401).json({error:"Invalid credentials"});
    }
});

// Get user by ID (IDOR vulnerability)
router.get('/user', async (req, res) => {
    const id = req.query.id;

    const user = await dal.getUserById(id)
    res.json(user); // ⚠️ no auth check
});

module.exports = router;