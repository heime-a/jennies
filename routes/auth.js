/* eslint-disable no-unused-vars */
const express = require('express');
const User = require('../models/users');
const UserSession = require('../models/usersession');

const router = express.Router();

router.post('/signup', async (req, res) => {
  let { email } = req.body;
  const { password } = req.body;

  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.',
    });
  }

  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.',
    });
  }

  email = email.toLowerCase().trim();

  const prevUser = await User.findOne({ email });

  if (prevUser) {
    return res.send({
      success: false,
      message: 'Error: Account already exists.',
    });
  }


  const newUser = new User();

  newUser.email = email;
  newUser.password = newUser.generateHash(password);

  try {
    await newUser.save();
    return res.send({
      success: true,
      message: 'Signed up',
    });
  } catch (err) {
    return res.send({
      success: false,
      message: `Error: Server error: ${err.stack}`,
    });
  }
});

// eslint-disable-next-line consistent-return
router.post('/signin', async (req, res) => {
  let { email } = req.body;
  const { password } = req.body;

  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.',
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.',
    });
  }

  email = email.toLowerCase();
  email = email.trim();

  try {
    const user = await User.findOne({ email });
    if (!(user && user.validPassword(password))) {
      return res.send({
        success: false,
        message: 'Error: User not found or password invalid',
      });
    }
    const userSession = new UserSession();
    // eslint-disable-next-line no-underscore-dangle
    userSession.userId = user._id;
    userSession.save((err, doc) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: server error',
        });
      }

      // eslint-disable-next-line no-underscore-dangle
      return res.cookie('token', JSON.stringify(doc._id), { httpOnly: true }).send({
        success: true,
        message: 'Login Successful',
        // eslint-disable-next-line no-underscore-dangle
        token: doc._id,
      });
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Server Error:', err);
    return res.send({
      success: false,
      message: 'Error: server error',
    });
  }
});


router.post('/logout', async (req, res) => {
  // Get the token
  const token = JSON.parse(req.cookies.token);
  try {
    await UserSession.findOneAndUpdate(
      { _id: token, isDeleted: false },
      { $set: { isDeleted: true } },
    );
    return res.send({
      success: true,
      message: 'Logout Success.',
    });
  } catch (err) {
    return res.send({
      success: false,
      message: `Error: Server error ${err.stack}`,
    });
  }
});

module.exports = router;
