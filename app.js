var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var expressSession = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studentData = require('./models/student');

var app = express();
mongoose.connect("mongodb://localhost/i-CES");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));

app.use(expressSession({
  secret: " JS ",
  resave: false,
  saveUninitialized: false,


}));
app.use(passport.initialize());
app.use(passport.session()); 

passport.use(new localStrategy(studentData.authenticate()));
passport.serializeUser(studentData.serializeUser());
passport.deserializeUser(studentData.deserializeUser());




var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')))

app.listen(4000, function(req, res){
  console.log('server connected');
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
