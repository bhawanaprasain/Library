var mongoose = require('mongoose');

const issueSchema = mongoose.Schema({
    student: {type: mongoose.Schema.Types.ObjectId, 
        ref: 'studentData'},
    issuedAt: Date,
    deadline: Date
});

var bookSchema = mongoose.Schema({
    title: String,
    author: String,
    details: String,
    source: String,
    created: {
        type: Date,
        default: Date.now
    },
    currentIssue: issueSchema, // To store who has the book currently
    issues: [issueSchema] // To store the history of issues
});


module.exports = mongoose.model('Books', bookSchema);