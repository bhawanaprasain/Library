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
        console.log(req.body.username);
        res.redirect("/admin");
      })
    })
  });

router.get('/login', function(req,res){
  res.render('login');

});


router.post('/login', passport.authenticate('local', {
  successRedirect: "/admin",
  failureRedirect: "/login",
}), function(req,res) {
  const username = req.body.username;
  //console.log(username);
  res.render('/admin');
  });

  router.get('/userlogin.ejs', function(req,res){
    res.render('userlogin');
  });
  
  // router.post('/userlogin', passport.authenticate('local', {
  //   successRedirect: "/issuedbooks",
  //   failureRedirect: "/login",
  // }), function(req,res) {
  //   console.log(req.body.username)
  //   IssuedBooks.findOne(id).exec(function (err,books) {
  //     console.log(books)
  //
  //   })
  //   // IssuedBooks.find().exec(function(err,issuedBooks){
  //   //   res.render('issuedbooks',{issuedBooks})
  //   // })
  //   });
router.post('/userlogin',function (req,res) {
  console.log(req.body.username)
   username = req.body.username;
  IssuedBooks.find({issuedBy: 'req.body.username'}).exec(function(err, books){
    res.render('borrowbooks', {books});

  });


})
  router.get('/logout', function(req ,res){
    req.logout();
    res.redirect('/home');
  })

  router.get('/admin', login_required, function(req,res){
    res.render('admin');
  })

  router.post('/addbooks', function(req,res){
    var books = new Books({
      title: req.body.title,
      author: req.body.author,
      details: req.body.details,
      source: req.body.source
    });
    var promise = books.save();
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

  router.get('/borrowbooks' ,function(req,res){
    //console.log(username);
    Books.find().exec(function(err, books){
      res.render('borrowbooks', {books});
    });
  })
  
  router.get('/borrow/:id' ,function(req,res){
    var bookId = req.params.id;
    Books.findOne({_id : bookId}).exec(function(err,book){
      var issuedBook= new IssuedBooks({
        issuedBy: username,
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
     /*
Now lets assume we have a book with id - bookID
To issue a book,
similarly studentId has the id of student


book.findById(bookId).then(function (book) {
   if(book.currentIssue){
       // book is currently issued
       // move it to history
       let deadline = new Date();
       deadline.setDate(deadline.getDate() + 30); // 1 month later

       book.issues.push(book.currentIssue);
       book.issue = {
           student: studentId,
           issuedAt: new Date(),
           deadline: deadline
       }
   }
});

 */
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
  
  router.get('/issuedbooks', function(req,res){
    studentData.findOne({username: 'bhawana'}).populate().exec(function(err,issuedbooks){
      console.log('issued books'+ issuedbooks);
    });
    // IssuedBooks.find().exec(function(err,issuedBooks){
    //   res.render('issuedbooks',{issuedBooks})
     })

 
  
module.exports = router;
