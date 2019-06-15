var mongoose = require('mongoose');

var issuedBookSchema = mongoose.Schema({
    studentId: mongoose.Schema.ObjectId ,
    userid: mongoose.Schema.Types.ObjectId,
    borrowedBy: String,
    title: String,
    author: String,
    details: String,
    source: String,
    created: { 
        type: Date,
        default: Date.now
    },
    issuedBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'studentData'
        }
    }

});
const issuedBooks = mongoose.model('IssuedBooks', issuedBookSchema, 'issuedbooks');
module.exports = issuedBooks;
