const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking");
const authenticateToken = require("../utils/authenticateToken");

router.get("/properties-count", bookingController.getPropertiesCount);

router.get("/types-count", bookingController.getTypesCount);

router.get("/top-rated-hotels", bookingController.getTopRatedHotels);

router.post("/search-hotels", bookingController.searchHotels);

router.post("/fetch-hotel", bookingController.fetchHotel);

router.post("/fetch-available-rooms", bookingController.fetchAvailableRooms);

router.post(
  "/transaction",
  authenticateToken,
  bookingController.postTransaction
);

router.post(
  "/all-transactions",
  authenticateToken,
  bookingController.getTransaction
);

module.exports = router;
