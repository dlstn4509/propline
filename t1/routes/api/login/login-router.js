const path = require('path');
const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/', async (req, res, next) => {
  const done = (err, user, msg) => {
    if (err) return next(err);
    else if (!user) return res.send(msg);
    else {
      req.logIn(user, (err) => {
        if (err) return next(err);
        else {
          return res.json(user);
        }
      });
    }
  };
  passport.authenticate('local', done)(req, res, next);
});

module.exports = { name: '/', router };
