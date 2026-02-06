const jwt = require("jsonwebtoken");
const path = require('path');
const {readUsers} = require('../controllers/AuthController.js')
require("dotenv").config();
const { JWT_SECRET } = process.env;
const filePath = path.join(__dirname, "..", "users.json");

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error(err.message);
        res.redirect("/signin");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/signin");
  }
};

module.exports.checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log('Chekuser started')
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (!err) {
        console.log(decodedToken.id);
        const users = readUsers();
        if(users) {
            console.log('Users obtained');
        }
        const foundUser = users.find((user) => user.id == decodedToken.id);
        res.locals.user=foundUser;
        console.log(foundUser);
        next();
      } else {
        res.locals.user=null;
        next();
      }
    });
  } else {
    res.locals.user=null;
    next();
  }
};
