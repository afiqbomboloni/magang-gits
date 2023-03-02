const db = require("../../models");
const config = require("../../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {

  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      if (result) res.send({ message: "User Baru berhasil terdaftar" });
    } else {

      const result = user.setRoles([1]);
      if (result) res.send({ message: "User Baru berhasil terdaftar" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User tidak ditemukan" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(400).send({
        message: "Invalid Password!",
      });
    }

    const token = 'Bearer ' + jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    // req.headers["x-access-token"] = token;

    return res.status(201).send({
      id: user.id,
      username: user.username,
      email: user.email,
      token: token,
      roles: authorities,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "Kamu berhasil sign out"
    });
  } catch (err) {
    this.next(err);
  }
};