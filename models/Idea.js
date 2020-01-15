/*
    Although MongoDB is a no SQL database, i.e. it doesn't require Schemas, it is good idea to create Schemas
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('ideas', IdeaSchema);