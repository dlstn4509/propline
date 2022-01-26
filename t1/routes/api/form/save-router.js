const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');

router.post('/', (req, res, next) => {
  res.json(req.body);
});

module.exports = { name: '/save', router };
