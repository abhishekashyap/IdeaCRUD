const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/signup', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({text: 'Passwords do not match'});
    }

    if(req.body.password.length < 8) {
        errors.push({text: 'Password should be atleast 8 characters long'});
    }

    if (errors.length > 0) {
        // Re-rendering the form with details
        res.render('users/signup', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
        })
    } else {
        res.send('Passed');
    }

});

module.exports = router;