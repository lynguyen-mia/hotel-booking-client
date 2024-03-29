const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const authenticateToken = require("./utils/authenticateToken");

// Models
const Hotel = require("./models/hotel");
const Rooms = require("./models/room");

// Routes
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin");

app.set("trust proxy", 1);
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "HEAD"],
    allowedHeaders: "Content-Type,Authorization"
  })
);
app.use(express.json());

app.use(authRoutes);
app.use(bookingRoutes);
app.use(adminRoutes);

mongoose
  .connect(
    "mongodb+srv://nguyenthihuongly21:Xd7J2dbJr8qR5DRU@booking-site.4csksum.mongodb.net/booking?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  });
