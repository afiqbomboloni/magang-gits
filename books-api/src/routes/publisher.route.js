const {authJwt} = require("../middleware")

module.exports = app => {
    const publishers = require("../controllers/publisher.controller.js");
  
    var router = require("express").Router();

    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });
  
    // Create a new Publisher
    router.post("/", 
    [authJwt.verifyToken, authJwt.isAdmin],
    publishers.create);
  
    // Retrieve all publishers
    router.get("/", 
    [authJwt.verifyToken],
    publishers.findAll);

  
    // Retrieve a single Publisher with id
    router.get("/:id", 
    [authJwt.verifyToken],
    publishers.findOne);
  
    // Update a Publisher with id
    router.put("/:id", 
    [authJwt.verifyToken, authJwt.isAdmin],
    publishers.update);
  
    // Delete a Publisher with id
    router.delete("/:id", 
    [authJwt.verifyToken, authJwt.isAdmin],
    publishers.delete);
  
  
    app.use('/api/publishers', router);
  };