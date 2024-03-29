const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// NORMAL USER AUTHENTICATION
exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const encryptedPass = await bcrypt.hash(password, 10);
  // Validation
  if (!email || !password || !email.includes("@") || password.length < 6) {
    return res
      .status(401)
      .json({ error: "Please enter a valid email or password" });
  }

  // Check if email exists in database or not
  User.find({ email: email }).then((user) => {
    if (user.length !== 0) {
      // user exists => return
      return res.status(401).json({
        error: "Email already existed. Please choose another email."
      });
    } else {
      // user doesn't exist => create a new one
      const newUser = new User({
        email: email,
        password: encryptedPass,
        username: req.body.username,
        fullname: req.body.fullname,
        phone: req.body.phone,
        isAdmin: false
      });
      newUser
        .save()
        .then(() => {
          return res.status(200).send();
        })
        .catch((err) => console.log(err));
    }
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // check if user exists in database or not
  User.findOne({ email: email }).then(async (user) => {
    if (!user) {
      return res.status(401).json({
        error: "User can't be found."
      });
    }
    // decrypt password & check if credentials are correct
    const passwordCheck = await bcrypt.compare(password, user?.password);
    if (passwordCheck) {
      // create token and send it to client
      const secretKey = "my-super-extra-secret-key";
      const token = jwt.sign({ id: user._id, email: user.email }, secretKey);
      return res.status(200).send({
        user: {
          id: user._id,
          email: user.email,
          fullname: user.fullname,
          phone: user.phone,
          isLogin: true
        },
        token: token
      });
    } else {
      return res.status(401).json({
        error: "Password is incorrect. Please try again."
      });
    }
  });
};

// ADMIN USER AUTHENTICATION
exports.postAdminLogin = (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  // check if user exists in database or not
  User.findOne({ email: email, isAdmin: true }).then(async (user) => {
    if (!user) {
      return res.status(401).json({
        error: "Admin user can't be found."
      });
    }
    // decrypt password & check if credentials are correct
    const passwordCheck = await bcrypt.compare(password, user?.password);
    if (passwordCheck) {
      // create token and send it to client
      const secretKey = "my-super-extra-secret-key";
      const token = jwt.sign({ id: user._id, email: user.email }, secretKey);
      return res.status(200).send({
        adminUser: {
          id: user._id,
          email: user.email,
          fullname: user.fullname,
          phone: user.phone,
          isLogin: true,
          isAdmin: true
        },
        adminToken: token
      });
    } else {
      return res.status(401).json({
        error: "Password is incorrect. Please try again."
      });
    }
  });
};

exports.postAdminSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const encryptedPass = await bcrypt.hash(password, 10);
  // Validation
  if (!email || !password || !email.includes("@") || password.length < 6) {
    return res
      .status(401)
      .json({ error: "Please enter a valid email or password" });
  }

  // Check if email exists in database or not
  User.find({ email: email, isAdmin: true }).then((user) => {
    if (user.length !== 0) {
      // user exists => return
      return res.status(401).json({
        error: "User already existed. Please choose another email."
      });
    } else {
      // user doesn't exist => create a new one
      const newUser = new User({
        email: email,
        password: encryptedPass,
        username: req.body.username,
        fullname: req.body.fullname,
        phone: req.body.phone,
        isAdmin: true
      });
      newUser
        .save()
        .then(() => {
          return res.status(200).send();
        })
        .catch((err) => console.log(err));
    }
  });
};
