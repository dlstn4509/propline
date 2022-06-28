const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const {
  makeMapBlock,
  makeDongList,
  findBlockCode,
  makeSubway,
  makeGu,
  makeSeoul,
  findSigungu,
  findEupmyeondong,
} = require('../../../models/item/Map');

router.get('/makemapblock', async (req, res, next) => {
  try {
    const { eupmyeondong } = req.query;
    const area = await makeMapBlock(eupmyeondong);
    res.status(200).json(area);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dongList', async (req, res, next) => {
  try {
    const dongList = await makeDongList();
    res.status(200).json(dongList);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blockcode', async (req, res, next) => {
  try {
    const { blockcode } = req.query;
    const data = await findBlockCode(blockcode);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/subway', async (req, res, next) => {
  try {
    const subwayList = await makeSubway();
    res.status(200).json(subwayList);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/gu', async (req, res, next) => {
  try {
    const gu = await makeGu();
    res.status(200).json(gu);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/seoul', async (req, res, next) => {
  try {
    const seoul = await makeSeoul();
    res.status(200).json(seoul);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/sigungu', async (req, res, next) => {
  try {
    const { sido } = req.query;
    const sigungu = await findSigungu(sido);
    res.status(200).json(sigungu);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/eupmyeondong', async (req, res, next) => {
  try {
    const { sido, sigungu } = req.query;
    const eupmyeondong = await findEupmyeondong(sido, sigungu);
    res.status(200).json(eupmyeondong);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
