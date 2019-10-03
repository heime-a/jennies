/* eslint-disable no-unused-vars */
const express = require("express");
const User = require("../models/users");
const UserSession = require("../models/usersession");

const router = express.Router();

router.get("/", async (req, res) => {
  const allUsers = await User.find({});
  res.json({
    message: "All User Objects",
    content: allUsers
  });
});

router.post("/signup", async (req, res) => {
  let { email } = req.body;
  const { password } = req.body;

  if (!email) {
    return res.send({
      success: false,
      message: "Error: Email cannot be blank."
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Error: Password cannot be blank."
    });
  }

  email = email.toLowerCase();
  email = email.trim();

  // Steps:
  // 1. Verify email doesn't exist
  // 2. Save
  const prevUser = await User.findOne({ email });
  if (prevUser && prevUser.length > 0) {
    return res.send({
      success: false,
      message: "Error: Account already exists."
    });
  }

  // Save the new user
  const newUser = new User();

  newUser.email = email;
  newUser.password = newUser.generateHash(password);

  try {
    await newUser.save();
    return res.send({
      success: true,
      message: "Signed up"
    });
  } catch (err) {
    return res.send({
      success: false,
      message: "Error: Server error"
    });
  }
});

router.post("/signin", async (req, res) => {
  let { email } = req.body;
  const { password } = req.body;

  if (!email) {
    return res.send({
      success: false,
      message: "Error: Email cannot be blank."
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Error: Password cannot be blank."
    });
  }

  email = email.toLowerCase();
  email = email.trim();

  try {
    const user = await User.findOne({ email });
    if (!user.validPassword(password)) {
      return res.send({
        success: false,
        message: "Error: Invalid"
      });
    }
    const userSession = new UserSession();
    userSession.userId = user._id;
    userSession.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: "Error: server error"
        });
      }

      return res.send({
        success: true,
        message: "Valid sign in",
        token: doc._id
      });
    });
  } catch (err) {
    console.log("err 2:", err);
    return res.send({
      success: false,
      message: "Error: server error"
    });
  }
});

router.get("/verify", async (req, res, next) => {
  // Get the token
  const { token } = req.query;
  // ?token=test

  // Verify the token is one of a kind and it's not deleted.
  try {
    const session = await UserSession.findOne({ _id: token, isDeleted: false });
    return res.send({
      success: true,
      message: "Good"
    });
  } catch (err) {
    return res.send({
      success: false,
      message: `Error: Server error ${err.stack}`
    });
  }
});

router.get("/logout", async (req, res) => {
  // Get the token
  const { query } = req;
  const { token } = query;
  // ?token=test

  // Verify the token is one of a kind and it's not deleted.
  try {
    await UserSession.findOneAndUpdate(
      { _id: token, isDeleted: false },
      { $set: { isDeleted: true } }
    );
    return res.send({
      success: true,
      message: "Good"
    });
  } catch (err) {
    return res.send({
      success: false,
      message: `Error: Server error ${err.stack}`
    });
  }
});
module.exports = router;
