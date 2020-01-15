const express = require('express');
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth'); // Using destructuring;

const router = express.Router();

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Ideas index route 
router.get('/', ensureAuthenticated, (req, res) => {
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

// Get ideas for edit
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
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
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
})

// Process form
router.post('', ensureAuthenticated, (req, res) => {
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
                req.flash('success_msg', 'Idea added')
                res.redirect('/ideas')
            })
    }
});

// Edit idea and update DB
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            // Updated values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Idea updated');
                    res.redirect('/ideas');
                })
        })
});

// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.deleteOne({ _id: req.params.id })
        .then(() => {
            console.log('Deleted entry');
            req.flash('success_msg', 'Idea removed');
            res.redirect('/ideas');
        });
});

module.exports = router;