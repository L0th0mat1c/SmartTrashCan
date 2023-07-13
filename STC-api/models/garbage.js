const mongoose = require("mongoose");

const enums = {
  state: ["full", "Empty", "Typed"],
};

const Garbage = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  state: { type: String, default: enums.state },
  fill_percentage: { type: Number, default: 0 },
  x: { type: Number, default: 0.082 },
  y: { type: Number, default: 0.082 },
  z: { type: Number, default: 0.082 },
});

module.exports = mongoose.model("Garbage", Garbage);
// module.exports = enums;
