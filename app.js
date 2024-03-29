const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@booking-site.4csksum.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

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
    origin: [
      "https://hotel-booking-reactjs.netlify.app",
      "https://hotel-booking-reactjs-admin.netlify.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "HEAD"],
    allowedHeaders: "Content-Type,Authorization"
  })
);
app.use(express.json());

app.use(authRoutes);
app.use(bookingRoutes);
app.use(adminRoutes);

mongoose.connect(MONGODB_URI).then(() => {
  app.listen(process.env.PORT || 5000);
});
