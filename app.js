const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express(); // Initializing the express app by express function

/*
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

// Load Idea Model
require('./models/Idea');
const idea = mongoose.model('ideas');

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
// Body parser in this case allows us to access whatever is submitted through the Idea form
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// Add Idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
})

// Process form
app.post('/ideas', (req, res) => {
    // Since in HTML form we are using post method
    console.log(req.body);

    // Form validation
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Please add a title' })
    }

    if (!req.body.details) {
        errors.push({ text: 'Please add some details' })
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas')
            })
    }
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`); // Using template string (``), this allows us to use variables without having to concatenate
});