const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');

router.get('/:item_no', async (req, res, next) => {
  try {
    res.status(200).json('빌딩인포');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
