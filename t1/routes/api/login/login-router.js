const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { login } = require('../../../models/login/login');

router.get('/', async (req, res, next) => {
  try {
    const data = await login(req.query);
    res.status(200).json(data);
    // res.status(200).redirect('https://t1.propline.co.kr/main');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
