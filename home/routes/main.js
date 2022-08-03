const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');

router.get('/', (req, res, next) => {
  res.json('aa');
});

module.exports = router;
