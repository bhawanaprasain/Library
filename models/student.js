var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var studentSchema =new mongoose.Schema({
    
    username: String,
    rollno: Number,
    password: String,
    repassword: String,
    email: String,       
    created: { 
            type: Date,
            default: Date
              } 
                    

});
studentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('studentData', studentSchema);