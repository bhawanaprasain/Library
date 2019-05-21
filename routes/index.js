var express = require('express');
var router = express.Router();
var passport = require('passport');

var studentData = require('../models/student');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/home', function(req, res){
  res.render('home');
});
router.get('/signup', function(req,res){
  res.render('signup');
});

router.post('/signup' ,function(req , res){
    studentData.register(new studentData({username: req.body.username}), req.body.password, function(err, student){
      if(err){
        console.log(err);
        return res.render('signup');
      }
      passport.authenticate("local")(req, res, function(){
        console.log(req.body.username);
        res.redirect("/borrowbooks");
      })
    })
  });

router.get('/login', function(req,res){
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: "/borrowbooks",
  failureRedirect: "/login",
}), function(req,res) {
  res.render('/borrowbooks');
  });

  router.get('/logout', function(req ,res){
    req.logout();
    res.redirect('/home');
  })

  router.get('/borrowbooks', isLoggedIn, function(req,res){
    res.render('borrowbooks');
  })
   
  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
  };
  

module.exports = router;
