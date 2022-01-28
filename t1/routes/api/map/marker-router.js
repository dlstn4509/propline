const express = require('express');
const router = express.Router();
const { makeMarker } = require('../../../models/map/FindMap');
const { makeCluster } = require('../../../modules/makeCluster-md');

router.get('/sm', async (req, res, next) => {
  try {
    let { top, bottom, left, right, sido, sigungu, dong, item_type } =
      req.query;
    let _top = Number(top);
    let _bottom = Number(bottom);
    let _left = Number(left);
    let _right = Number(right);
    const { rs } = await makeMarker(
      // const { rs } = await findAllMap(
      top,
      bottom,
      left,
      right,
      sido,
      sigungu,
      dong,
      item_type
    );
    // res.status(200).json(data);
    const data = await makeCluster(rs, _top, _bottom, _left, _right, 10);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/lg', async (req, res, next) => {
  try {
    let { top, bottom, left, right, sido, sigungu, dong, item_type } =
      req.query;
    let _top = Number(top);
    let _bottom = Number(bottom);
    let _left = Number(left);
    let _right = Number(right);
    const { rs } = await makeMarker(
      top,
      bottom,
      left,
      right,
      sido,
      sigungu,
      dong,
      item_type
    );
    const data = await makeCluster(rs, _top, _bottom, _left, _right, 5);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { router, name: '/marker' };
