var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var studentSchema =new mongoose.Schema({
    
    username: String,
    rollno: Number,
    email:String,
    created: { 
            type: Date,
            default: Date.now
              } ,
    books: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'issuedBooks'
              }]

});
studentSchema.plugin(passportLocalMongoose);
const studentData = mongoose.model('studentData', studentSchema, 'students');
module.exports = { studentData}