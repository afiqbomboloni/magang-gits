const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!authHeader) {
    return res.status(403).send({
      message: "Tidak ada token yang tersedia",
    });
  }
  if(authHeader.split(' ')[0] !== 'Bearer') {
    return res.status(400).send({
      auth: false,
      message: "Incorrect token format"
    })
  }




  if (!token) {
    return res.status(400).send({
      message: "Tidak ada token yang tersedia",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(401).send({
      message: "Fitur hanya untuk admin",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role",
    });
  }
};
const authJwt = {
  verifyToken,
  isAdmin,
};
module.exports = authJwt;