const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express(); // Initializing the express app by express function

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

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
// Body parser in this case allows us to access whatever is submitted through the Idea form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

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

// Ideas index route 
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({
            date: 'desc'
        })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        })
})

// Edit ideas
app.get('/ideas/edit/:id', (req, res) => {
    // :id acts as a placeholder, for the id of the idea from the DB
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            })
        })
})

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
});

app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            // Updated values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    res.redirect('/ideas')
                })
        })

})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`); // Using template string (``), this allows us to use variables without having to concatenate
});