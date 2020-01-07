const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express(); // Initializing the express app by express function

/*
After installing MongoDB, setup MongoDB by using:
$ mongod --directoryperdb --dbpath /path/to/db
Create directory as data/db for storing
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

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`); // Using template string (``), this allows us to use variables without having to concatenate
});