const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  fullname: { type: String, required: false },
  phone: { type: Number, required: true },
  isAdmin: { type: Boolean, required: true }
});

module.exports = mongoose.model("User", userSchema);
