const express = require('express');

const app = express(); // Initializing the express app by express function

// Index route
app.get('/', (req, res) => {
    res.send('INDEX')
})

// About route
app.get('/about', (req, res) => {
    res.send('ABOUT')
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`); // Using template string (``), this allows us to use variables without having to concatenate
});