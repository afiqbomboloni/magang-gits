const { verifyRegister } = require("../middleware");
const controller = require("../v1/controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/v1/auth/signup",
    [
      verifyRegister.checkDuplicateUsernameOrEmail,
      verifyRegister.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/v1/auth/signin", controller.signin);

  app.post("/api/v1/auth/signout", controller.signout);
};