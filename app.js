const express = require('express');
const exphbs = require('express-handlebars');

const app = express(); // Initializing the express app by express function

// Handlebars middleware
app.engine('handlebars', exphbs({ 
    defaultLayout: 'main'
 }));
app.set('view engine', 'handlebars');

// Index route
app.get('/', (req, res) => {
    res.render('index')
})

// About route
app.get('/about', (req, res) => {
    res.send('ABOUT')
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`); // Using template string (``), this allows us to use variables without having to concatenate
});