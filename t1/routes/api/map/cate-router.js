const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { makeCate } = require('../../../models/map/MakeCate');

router.get('/', async (req, res, next) => {
  try {
    const { sido, sigungu, dong } = req.query;
    const { cate } = await makeCate(sido, sigungu, dong);
    res.status(200).json(cate);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/cate', router };
