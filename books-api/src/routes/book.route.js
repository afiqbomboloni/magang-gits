const {authJwt} = require("../middleware")

module.exports = app => {
    const books = require("../controllers/book.controller.js");
  
    var router = require("express").Router();

    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });
  
    // Create a new Book
    router.post("/", 
    [authJwt.verifyToken, authJwt.isAdmin],
    books.create);
  
    // Retrieve all Books
    router.get("/", 
    [authJwt.verifyToken],
    books.findAll);

  
    // Retrieve a single Book with id
    router.get("/:id", 
    [authJwt.verifyToken],
    books.findOne);
  
    // Update a Book with id
    router.put("/:id", 
    [authJwt.verifyToken, authJwt.isAdmin],
    books.update);
  
    // Delete a Book with id
    router.delete("/:id", 
    [authJwt.verifyToken, authJwt.isAdmin],
    books.delete);

    // Retrieve a single Book with Publisher
    router.get("/getbookpublisher/:id", 
    [authJwt.verifyToken],
    books.getBookPublisher);
  
  
    app.use('/api/books', router);
  };