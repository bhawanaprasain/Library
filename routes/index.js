var express = require('express');
var router = express.Router();
var passport = require('passport');

var studentData = require('../models/student'); 
var Books = require('../models/book');
var IssuedBooks = require('../models/issuedbooks');


function login_required(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
};

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
        console.log(req.user._id);
        res.redirect("/borrowbooks");
      })
    })
  });

router.get('/login', function(req,res){
  res.render('login');

});


router.post('/login', passport.authenticate('local', {
  successRedirect: "/admin",
  failureRedirect: "/login",
}));

  router.get('/userlogin.ejs', function(req,res){
    res.render('userlogin');

  });

router.post('/userlogin', function(req , res) {

    passport.authenticate("local")(req, res, function () {
      console.log(req.user._id);
      // res.redirect("/borrowbooks");
      Books.find().exec(function(err, books){
        res.render('viewbooks', {books});
      });
      IssuedBooks.find({userid: req.user._id}).exec(function (err, issuedBooks) {
        // console.log(issuedBooks);
        res.render('issuedbooks', {issuedBooks})
      });
    })
  });

  router.get('/logout', function(req ,res){
    req.logout();
    res.redirect('/home');
  })

  router.get('/admin', login_required, function(req,res){
    res.render('admin');
  })

  router.post('/addbooks', function(req,res){
    // console.log(req.user._id);

    var books = new Books({
      title: req.body.title,
      author: req.body.author,
      details: req.body.details,
      source: req.body.source
    });
    var promise = books.save();
    console.log(books)
    promise.then((books)=>{ 
    Books.find().exec(function(err, books){
      res.render('viewbooks', {books});
});

  })
  })

  router.get('/viewbooks' ,function(req,res){
    Books.find().exec(function(err, books){
      res.render('viewbooks', {books});
    });
  })

  router.get('/borrowbooks' ,  login_required, function(req,res){
    console.log(req.user._id);
    Books.find().exec(function(err, books){
      res.render('borrowbooks', {books});
    });
  })
  
  router.get('/borrow/:id' ,login_required, function(req,res){
    console.log(req.user._id);

    var bookId = req.params.id;
    console.log(req.user._id);
    Books.findOne({_id : bookId}).exec(function(err,book){
      var issuedBook= new IssuedBooks({
       userid: req.user._id,
        title: book.title,
        author: book.author,
        details: book.details,
        source: book.source,
      });
        var promise = issuedBook.save();
        promise.then((issuedBook)=>{ 
        console.log("you have borrowed these boooks", issuedBook);
        Books.remove({_id : req.params.id},function(err ,delBook){
          console.log("Books removed from admin page");
        });
          Books.find().exec(function(err, books){
          res.render('viewbooks', {books});
        })
    })

    });
  })

  router.get('/return/:id' , function(req,res){
    var returnId = req.params.id;
    IssuedBooks.findOne({_id : returnId}).exec(function(err,issuedBook){
      var returnedBook = new Books({
        title: issuedBook.title,
        author: issuedBook.author,
        source: issuedBook.source,
        details: issuedBook.details
      });
      var promise = returnedBook.save();
      promise.then((returnedBook)=>{
        IssuedBooks.remove({_id:req.params.id}, function(err,retBooks){
          console.log('returned books has been added to admin page and has been removed from borrowbooks page');
        })
      })
    })
  })

  // router.get('/returnbooks', function(req,res){
  //   IssuedBooks.find().exec(function(err,booksToBeReturned){
  //     res.render('returnbooks',{booksToBeReturned})
  //   })
  // })
  
  router.get('/issuedbooks',login_required, function(req,res) {
    // studentData.findOne({username: 'bhawana'}).populate().exec(function(err,issuedbooks){
    //   console.log('issued books'+ issuedbooks);
    // });
    IssuedBooks.find({userid: req.user._id}).exec(function (err, issuedBooks) {
     // console.log(issuedBooks);
      res.render('issuedbooks', {issuedBooks})
    });
  })

 
  
module.exports = router;
