const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');

router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(req.body);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/cate', router };
