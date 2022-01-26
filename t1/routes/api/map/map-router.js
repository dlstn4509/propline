const express = require('express');
const router = express.Router();
const { findAllMap, findAllMapCnt } = require('../../../models/map/FindMap');

router.get('/', async (req, res, next) => {
  try {
    if (req.query.limit) {
      let { top, bottom, left, right, limit, sido, sigungu, dong, item_type } =
        req.query;
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
      res.status(200).json(maps);
    } else {
      let { top, bottom, left, right, sido, sigungu, dong, item_type } =
        req.query;
      const { mapsCnt } = await findAllMapCnt(
        top,
        bottom,
        left,
        right,
        sido,
        sigungu,
        dong,
        item_type
      );
      res.status(200).json(mapsCnt);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { router, name: '/' };
