const path = require('path');
const express = require('express');
const { findCenter } = require('../../../models/map/FindMap');
const router = express.Router();

router.get('/center', async (req, res, next) => {
  try {
    let latSum = 0;
    let lngSum = 0;
    let priceSum = 0;
    let depositSum = 0;
    let rentSum = 0;
    let mfeeSum = 0;
    let { sido, sigungu, dong, item_type } = req.query;
    const { rs } = await findCenter(sido, sigungu, dong, item_type);
    rs.map((v) => {
      latSum += v.lat;
      lngSum += v.lng;
      priceSum += v.price;
      depositSum += v.deposit;
      rentSum += v.rent;
      mfeeSum += v.mfee;
    });
    res
      .status(200)
      .json([
        latSum / rs.length,
        lngSum / rs.length,
        Math.round(priceSum / rs.length),
        Math.round(depositSum / rs.length),
        Math.round(rentSum / rs.length),
        Math.round(mfeeSum / rs.length),
      ]);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
