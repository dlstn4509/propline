const path = require('path');
const express = require('express');
const {
  findAllMap,
  findAllMapCnt,
  makeMarker,
} = require('../../models/find-map');
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

router.get('/marker', async (req, res, next) => {
  try {
    let { top, bottom, left, right } = req.query;
    let _top = Number(top);
    let _bottom = Number(bottom);
    let _left = Number(left);
    let _right = Number(right);
    let _height = (_top - _bottom) / 5;
    let _width = (_right - _left) / 5;
    const { rs } = await makeMarker(top, bottom, left, right);

    let data = [[], [], [], [], []];

    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        let arr = rs.filter((v) => {
          return (
            v.lng > _left + _width * (i - 1) &&
            v.lng < _left + _width * i &&
            v.lat < _top - _height * (j - 1) &&
            v.lat > _top - _height * j
          );
        });
        data[i - 1].push(arr);
      }
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { router, name: '/map' };
