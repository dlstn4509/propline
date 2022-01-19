const path = require('path');
const express = require('express');
const { findAllMap, findAllMapCnt } = require('../../models/find-map');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    if (req.query.limit) {
      let { top, bottom, left, right, limit } = req.query;
      const { maps } = await findAllMap(top, bottom, left, right, limit);
      res.status(200).json(maps);
    } else {
      let { top, bottom, left, right } = req.query;
      const { mapsCnt } = await findAllMapCnt(top, bottom, left, right);
      res.status(200).json(mapsCnt);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { router, name: '/map' };
