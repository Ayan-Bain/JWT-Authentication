const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { JWT_SECRET } = process.env;

const filePath = path.join(__dirname, "..", "users.json");
console.log(filePath);

const readUsers = () => {
  try {
    const users = fs.readFileSync(filePath, "utf8");
    return JSON.parse(users);
  } catch (e) {
    console.error("Some error occured during file reading", e);
    return ("Some error occured during file reading", e);
  }
};

const writeUsers = (newData) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(newData));
    return true;
  } catch (e) {
    console.error("Error in writing to file", e);
    return false;
  }
};

const addUser = (email, hashed_password) => {
  const uuid = uuidv4();
  const userWithID = { email, hashed_password, id: uuid };
  console.log(userWithID);
  let users = readUsers();
  users.push(userWithID);
  const done = writeUsers(users);
  if (done) {
    console.log("Writing to file Successful");
  } else {
    console.log("No");
  }
  return userWithID;
};
const maxAgeJWTToken = 30 * 24 * 60 * 60;
const createJWTToken = (id, hashed_password) => {
  return jwt.sign({ id, hashed_password }, JWT_SECRET, {
    expiresIn: maxAgeJWTToken,
  });
};

const get_users = (req, res) => {
  const data = readUsers();
  res.send(data);
};

// exports.post_users = (req, res)=> {
//     const newData=addUser(req);
//     res.send(newData);
// };

const get_user_by_id = (req, res) => {
  const users = readUsers();
  const { id } = req.params;
  const foundUser = users.find((user) => user.id == id);
  res.send(foundUser);
};

const delete_user_by_id = (req, res) => {
  let users = readUsers();
  const { id } = req.params;
  users = users.filter((user) => user.id != id);
  writeUsers(users);
  console.log(`Deleted user ${id} successfully`);
  res.send(users);
};

const update_user_by_id = (req, res) => {
  const { name, age } = req.body;
  const { id } = req.params;
  const users = readUsers();
  let user = users.find((user) => user.id == id);
  let rest = users.filter((user) => user.id != id);
  if (name) user.name = name;
  if (age) user.age = age;
  const newData = [user, ...rest];
  writeUsers(newData);
  console.log(`Updated user ${id} successfully`);
  res.send(newData);
};

const signup = async (req, res) => {
  const { email, password } = req.body;
  const hashed_password = await bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(hash);
    const newData = addUser(email, hash);
    const JWTToken = createJWTToken(newData.id, newData.hashed_password);
    res.cookie("jwt", JWTToken, {
      maxAge: maxAgeJWTToken * 1000,
      httpOnly: true,
    });
    res.send(newData);
  });
};

const signin = (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((user) => user.email === email);

  bcrypt.compare(password, user.hashed_password, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }
    if (result) {
      console.log("Password correct!");
      const JWTToken = createJWTToken(user.id, user.hashed_password);
    res.cookie("jwt", JWTToken, {
      maxAge: maxAgeJWTToken * 1000,
      httpOnly: true,
    });
    res.redirect('/')
    } else {
      console.log("Password incorrect!");
      res.send("Password incorrect!");
    }
  });
};

const logout = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}

module.exports = {
  addUser,
  writeUsers,
  readUsers,
  get_users,
  get_user_by_id,
  update_user_by_id,
  signin,
  signup,
  delete_user_by_id,
  logout
};
