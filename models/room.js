const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  maxPeople: { type: Number, required: true },
  desc: { type: String, required: true },
  roomNumbers: [{ type: Number, required: true }],
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false }
});

module.exports = mongoose.model("Room", roomSchema);
