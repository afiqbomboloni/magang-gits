const {authJwt} = require("../middleware")


module.exports = app => {
  var router = require("express").Router();
  
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  const authors = require("../v1/controllers/author.controller.js");
  
    
  
    // Create a new Author
    router.post("/", 
    [authJwt.verifyToken, authJwt.isAdmin],
    authors.create);
  
    // Get all Authors
    router.get("/", 
    [authJwt.verifyToken],
    authors.findAll);

  
    // Get a single Author with id
    router.get("/:id", 
    [authJwt.verifyToken],
    authors.findOne);

    // Get a single Author with id
    router.get("/getauthorbooks/:id", 
    [authJwt.verifyToken],
    authors.getAuthorBooks);
  
    // Update a Author with id
    router.put("/:id", 
    [authJwt.verifyToken, authJwt.isAdmin],
    authors.update);
  
    // Delete a Author with id
    router.delete("/:id", 
    [authJwt.verifyToken, authJwt.isAdmin],
    authors.delete);
  
  
    app.use('/api/v1/authors', router);
  };