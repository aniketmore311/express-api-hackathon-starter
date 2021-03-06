const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const createError = require("http-errors");
const { body } = require("express-validator");
const { getConfig } = require("../config/configService");

const { validate, authenticate } = require("../middleware");
const { catchAsync } = require("../utils/index");
const router = express.Router();

const SECRET_KEY = getConfig("SECRET_KEY");

router.post(
  "/signup",
  body("name").not().isEmpty().withMessage("name is required"),
  body("email").not().isEmpty().withMessage("email is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
  body("username").not().isEmpty().withMessage("username is required"),
  validate(),
  catchAsync(async (req, res) => {
    const { name, email, password, username } = req.body;

    let checkUser1 = await User.findOne({ email: email });

    if (checkUser1) {
      const error = createError(400, "User already exists with this email.");
      throw error;
    }

    let checkUser2 = await User.findOne({ username: username });

    if (checkUser2) {
      const error = createError(400, "User already exists with this username.");
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await user.save();

    res.json({
      message: "User signed-up successfully!",
    });
  })
);

router.post(
  "/login",
  body("username").not().isEmpty().withMessage("Username is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
  validate(),
  catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      const error = createError(400, "User does not exist.");
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = createError(400, "Password is incorrect.");
      throw error;
    }
    const respUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    };
    const accessToken = jwt.sign(respUser, SECRET_KEY, {
      expiresIn: "7d",
    });
    return res.json({
      accessToken,
    });
  })
);

router.get(
  "/protected",
  authenticate(),
  catchAsync(async (req, res) => {
    return res.json({
      message: "You are logged in",
      user: req.user,
    });
  })
);

module.exports = router;

