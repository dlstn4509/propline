const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');

router.get('/', (req, res, next) => {
  // res.render('main/main', { user: req.user });
  res.json(req.user);
});

module.exports = { name: '/', router };
