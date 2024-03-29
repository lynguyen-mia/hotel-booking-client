const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");
const authenticateToken = require("../utils/authenticateToken");

router.get("/get-board-info", authenticateToken, adminControllers.getBoardInfo);

router.get("/hotel-list", authenticateToken, adminControllers.getHotelList);

router.post(
  "/delete-hotel",
  authenticateToken,
  adminControllers.postDeleteHotel
);

router.use("/add-hotel", authenticateToken, adminControllers.addHotel);

router.get("/room-list", authenticateToken, adminControllers.getRooms);

router.post("/delete-room", authenticateToken, adminControllers.postDeleteRoom);

router.use("/add-room", authenticateToken, adminControllers.postAddRoom);

router.get(
  "/all-transactions",
  authenticateToken,
  adminControllers.getAllTransactions
);

router.post("/fetch-hotel", authenticateToken, adminControllers.postFetchHotel);

router.post("/fetch-room", authenticateToken, adminControllers.postFetchRoom);

module.exports = router;
