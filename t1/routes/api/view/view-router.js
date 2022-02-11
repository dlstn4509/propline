const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { findHome } = require('../../../models/view/FindHome');
const { buildingInfo } = require('../../../models/view/BuildInfo');

router.get('/:item_no', async (req, res, next) => {
  try {
    let { item_no } = req.params;
    const data = await findHome(item_no);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/buildinginfo/:item_no', async (req, res, next) => {
  try {
    const { bcode, bun, ji } = req.query;
    const data = await buildingInfo(bcode, bun, ji);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
