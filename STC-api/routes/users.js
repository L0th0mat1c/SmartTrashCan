var express = require("express");
var router = express.Router();
const User = require("../models/user");
require("dotenv").config();
const { checkJWT } = require("../middlewares/security");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();

    return res.json(users);
  } catch (e) {
    return res.status(500).json(e);
  }
};

const getUser = ({ params }, res) => {
  try {
    const user = User.find({ _id: params.id }).lean();
    return res.json(garbage);
  } catch (e) {
    return res.status(500).json(e);
  }
};

const createUser = async ({ body }, res) => {
  try {
    const newUser = new User(body);
    await newUser.save();
    const user = await User.findOne({ _id: newUser._id });

    return res.json({
      data: { message: "Created successfully !", data: garbage },
    });
  } catch (e) {
    return res.status(500).json(e);
  }
};

const updateUser = async ({ params, body }, res) => {
  try {
    await User.updateOne({ _id: params.id }, body);

    res.json({ data: "Updated successfully !" });
  } catch (e) {
    return res.status(500).json(e);
  }
};

const deleteUser = async ({ params }, res) => {
  try {
    await User.deleteOne({ _id: params.id });

    res.json({ data: "Deleted successfully !" });
  } catch (e) {
    return res.status(500).json(e);
  }
};
router.get("/users", checkJWT, getAllUsers);
router.get("/users/:id", checkJWT, getUser);
router.post("/users", checkJWT, createUser);
router.patch("/users/:id", checkJWT, updateUser);
router.delete("/users/:id", checkJWT, deleteUser);

module.exports = router;
