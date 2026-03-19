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

// Login
router.post('/login', async (req, res) => {
    console.log(req.body);
    let user = await dal.findUser(req.body.username, req.body.password)

    if (user) {
        res.json(user);
    } else {
        res.status(401).json({error:"Invalid credentials"});
    }
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
    const id = req.query.id;
    const user = await dal.getUserById(id)
    res.json(user);
});

module.exports = router;
