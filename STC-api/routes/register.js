var express = require("express");
var router = express.Router();
const bc = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();

const saltRounds = 10;

const registerUser = async ({ body }, res) => {
  console.log(body);
  const { email, password, username } = body;
  try {
    if (!(email && password && username)) {
      res.status(400).send("All input is required");
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const hashedPwd = await bc.hash(password, saltRounds);
    const newUser = new User({
      ...body,
      password: hashedPwd,
    });
    await newUser.save();

    return res.json({
      data: { message: "Created successfully !" },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

router.post("/register", registerUser);

module.exports = router;
