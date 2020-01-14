const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const app = express(); // Initializing the express app by express function

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport configuration
require('./config/passport')(passport);

/*
Installing mongodb 

After installing MongoDB, setup MongoDB by using:
$ mongod --directoryperdb --dbpath /path/to/db
Create directory as data/db for storing

In another terminal
$ mongo 
> show dbs
*/

// Connect to mongoose
mongoose.connect('mongodb://localhost/ideas-dev', {
    // To remove warnings
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB Connected')
    })
    .catch(err => console.log(err));

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
// Body parser in this case allows us to access whatever is submitted through the Idea form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serving static folder (requires node's path module)
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret', //This is the secret used to sign the session ID cookie. This can be either a string for a single secret, or an array of multiple secrets. If an array of secrets is provided, only the first element will be used to sign the session ID cookie, while all the elements will be considered when verifying the signature in req
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next(); // Implies we wanna call the next piece of middleware
});

// Index route
app.get('/', (req, res) => {
    const title = 'Welcome'
    res.render('index', {
        title: title
    });
});

// About route
app.get('/about', (req, res) => {
    // res.send('ABOUT');
    res.render('about');
});

// Ideas routes
app.use('/ideas', ideas);

// User routes
app.use('/users', users);

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`); // Using template string (``), this allows us to use variables without having to concatenate
});