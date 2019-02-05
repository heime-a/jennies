const express = require('express');

const router = express.Router();
const UserSession = require('../models/usersession');
const User = require('../models/user');

router.post('/api/account/signin', (req, res, next) => {
  const { body } = req;
  const {
    password,
  } = body;
  let {
    email,
  } = body;
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
  User.find({
    email,
  }, (err, users) => {
    if (err) {
      console.log('err 2:', err);
      return res.send({
        success: false,
        message: 'Error: server error',
      });
    }
    if (users.length != 1) {
      return res.send({
        success: false,
        message: 'Error: Invalid',
      });
    }
    const user = users[0];
    if (!user.validPassword(password)) {
      return res.send({
        success: false,
        message: 'Error: Invalid',
      });
    }
    // Otherwise correct user
    const userSession = new UserSession();
    userSession.userId = user._id;
    userSession.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: server error',
        });
      }
      return res.send({
        success: true,
        message: 'Valid sign in',
        token: doc._id,
      });
    });
  });
});
