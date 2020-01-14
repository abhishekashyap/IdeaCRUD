const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = mongoose.model('users');

// Exporting startegy as a module
module.exports = function (passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({
            email: email
        })
        .then(user => {
            // If there is not a user
            if (!user) {
                return done(null, false, {message: 'No user found'});
            }
        })
    }))
  }
