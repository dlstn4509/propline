const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');

router.get('/', (req, res, next) => {
  req.app.locals.css = 'admin-banner';
  req.app.locals.js = 'admin-banner';
  res.render('banner/banner', { user: req.user });
});

module.exports = { name: '/', router };
