var express = require("express");
var router = express.Router();
const bc = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const logger = require("../utils/logger");

const saltRounds = 10;

const loginUser = async ({ body }, res) => {
  try {
    // Get user input
    const { email, password } = body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bc.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user: user._id, email, role: user.role },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user data
      const userToSend = {
        username: user.username,
        email: user.email,
        role: user.role,
      };
      // user
      res.status(200).json({ user: { ...userToSend }, token });
    } else {
      logger.warn("Invalid Credentials");
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    logger.warn(err);
    res.status(500).send(err);
  }
};

router.post("/login", loginUser);

module.exports = router;
