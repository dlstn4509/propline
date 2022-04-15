const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');

router.get('/', (req, res, next) => {
  req.app.locals.css = 'admin-login';
  res.render('login/login');
});

module.exports = { name: '/', router };
