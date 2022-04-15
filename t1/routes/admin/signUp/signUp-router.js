const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const axios = require('axios');

router.get('/', (req, res, next) => {
  req.app.locals.css = 'admin-signUp';
  req.app.locals.js = 'admin-signUp';
  res.render('signUp/signUp');
});

module.exports = { name: '/', router };
