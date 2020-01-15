module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated) {
            // isAuthenticated is method from passport, if it's true we call the next piece of middleware, else we redirect
            return next();
        } else {
            req.flash('error_msg', 'Not authorized in');
            res.redirect('/users/login');
        }
    }
}