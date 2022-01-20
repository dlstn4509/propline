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
    const { rs } = await makeMarker(top, bottom, left, right);
    let markers = [[], []];
    for (let i = 0; i < rs.length; i++) {
      markers[0].push(rs[i].lat);
      markers[1].push(rs[i].lng);
    }
    markers[0].sort();
    markers[1].sort();

    new kakao.maps.Marker({
      position: new kakao.maps.LatLng(123, 36),
    });

    res.status(200).json(markers);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { router, name: '/map' };
