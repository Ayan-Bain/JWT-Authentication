const express = require('express');

const {
  get_users,
  get_user_by_id,
  delete_user_by_id,
  update_user_by_id,
  signup,
  signin
} = require("../controllers/AuthController.js");

const router = express.Router();

router.get("/users", get_users);

router.get("/users/:id", get_user_by_id);

router.delete("/users/:id", delete_user_by_id);

router.patch("/users/:id", update_user_by_id);

router.post('/signup', signup);

router.post('/signin', signin);

module.exports = router;
