const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.get('/signup', (req, res) => {
    res.send('signup');
});

module.exports = router;