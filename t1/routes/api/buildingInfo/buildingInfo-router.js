const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { findHome } = require('../../../models/view/FindHome');
const { buildingInfo, junyubu } = require('../../../models/view/BuildInfo');

router.get('/:item_no', async (req, res, next) => {
  try {
    const { bcode, bun, ji, infotype, bldNm, dongNm } = req.query;
    if (infotype === 'getBrExposPubuseAreaInfo') {
      const data = await junyubu(bcode, bun, ji, infotype, bldNm, dongNm);
      res.status(200).json(data);
    } else {
      const data = await buildingInfo(bcode, bun, ji, infotype);
      res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
