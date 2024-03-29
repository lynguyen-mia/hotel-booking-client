const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth");

router.post("/login", authControllers.postLogin);

router.post("/signup", authControllers.postSignup);

router.post("/admin-login", authControllers.postAdminLogin);

router.post("/admin-signup", authControllers.postAdminSignup);

module.exports = router;
