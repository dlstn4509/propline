const express = require('express');
const router = express.Router();
const { findAllMap } = require('../../../models/map/FindMap');

router.get('/', async (req, res, next) => {
  try {
    let { top, bottom, left, right, limit, sido, sigungu, dong, item_type } = req.query;
    const { maps } = await findAllMap(
      top,
      bottom,
      left,
      right,
      limit,
      sido,
      sigungu,
      dong,
      item_type
    );
    res.status(200).json([maps]);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { router, name: '/' };
