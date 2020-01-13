const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For hashing passwords
//const passport = require('passport');

const router = express.Router();

// User model
require('../models/User');
const User = mongoose.model('users');

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
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user => {
                    req.flash('success_msg', 'You are now registered and can login');
                    res.redirect('/users/login');
                })
                .catch(err => {
                    console.log(err);
                    return;
                })
            })
        })
    }

});

module.exports = router;