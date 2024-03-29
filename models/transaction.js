const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
  room: [
    {
      roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
      roomNumbers: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true }, // will be saved as ISO 8601 format: 2023-12-27T17:00:00.000Z
  price: { type: Number, required: true }, // will be saved as ISO 8601 format: 2023-12-27T17:00:00.000Z
  payment: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, required: true }
});

module.exports = mongoose.model("Transaction", transactionSchema);
