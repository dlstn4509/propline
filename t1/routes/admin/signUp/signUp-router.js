const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const axios = require('axios');
const { adminSignUp } = require('../../../models/admin/signUp/SignUp');

router.get('/', (req, res, next) => {
  req.app.locals.css = 'admin-signUp';
  req.app.locals.js = 'admin-signUp';
  res.render('signUp/signUp');
});

router.post('/', async (req, res, next) => {
  try {
    const { success } = await adminSignUp(req.body);
    success ? res.status(200).redirect('/admin/login') : '';
    // res.status(200).json(rs);
    // res.status(200).json(req.body);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
