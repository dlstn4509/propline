const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { saveFindItem } = require('../../../models/findItem/FindItem');

router.get('/', (req, res, next) => {});
router.post('/', async (req, res, next) => {
  try {
    const { success } = await saveFindItem(req.body);
    success ? res.redirect('/finditem') : next(err);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
