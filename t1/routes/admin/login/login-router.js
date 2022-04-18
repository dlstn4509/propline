const path = require('path');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { alert } = require('../../../modules/util');

router.get('/', async (req, res, next) => {
  req.app.locals.css = 'admin-login';
  res.render('login/login');
});
router.post('/', async (req, res, next) => {
  const done = (err, user, msg) => {
    if (err) return next(err);
    else if (!user) return res.send(alert(msg, '/admin/login'));
    else {
      req.logIn(user, (err) => {
        if (err) return next(err);
        else {
          return res.send(alert('로그인 되었습니다.', '/admin/main'));
        }
      });
    }
  };
  passport.authenticate('local', done)(req, res, next);
});

module.exports = { name: '/', router };
