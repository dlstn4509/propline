const path = require('path');
const express = require('express');
const { findCenter } = require('../../../models/map/FindMap');
const router = express.Router();

router.get('/center', async (req, res, next) => {
  try {
    let latSum = 0;
    let lngSum = 0;
    let { sido, sigungu, dong, item_type } = req.query;
    const { rs } = await findCenter(sido, sigungu, dong, item_type);
    rs.map((v) => {
      latSum += v.lat;
      lngSum += v.lng;
    });
    res.status(200).json([latSum / rs.length, lngSum / rs.length]);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
