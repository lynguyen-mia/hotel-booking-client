const jwt = require("jsonwebtoken");
const User = require("../models/user");

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }
  const secretKey = "my-super-extra-secret-key";

  jwt.verify(token, secretKey, async (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Find logged in user in database
    const curUser = await User.findById(user.id);
    // Associate requests with current user
    req.user = curUser;
    next();
  });
}

module.exports = authenticateToken;
