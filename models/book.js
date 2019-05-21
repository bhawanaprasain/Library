var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
    title: String,
    author: String,
    created: { 
        type: Date,
        default: Date.now
    }


})
