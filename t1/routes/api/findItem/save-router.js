const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { saveFindItem } = require('../../../models/findItem/FindItem');

router.get('/', (req, res, next) => {});
router.post('/', async (req, res, next) => {
  try {
    const rs = await saveFindItem(req.body);
    // rs.affectedRows === 1 ? res.status(200).json({success: true}) : next(err);
    // rs.affectedRows === 1 ? res.redirect('http://localhost:3000/finditem') : next(err);
    // console.log(rs);
    res.status(200).send(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
