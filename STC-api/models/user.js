const mongoose = require("mongoose");

const enums = {
  role: ["ADMIN", "USER", "IOT"],
};

const User = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: enums.role, required: true },
});

module.exports = mongoose.model("User", User);
// module.exports = enums;
