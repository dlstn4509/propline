const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { makeMapBlock, makeLabel, findBlockCode, makeSubway } = require('../../../models/item/Map');

router.get('/makemapblock', async (req, res, next) => {
  try {
    const { eupmyeondong } = req.query;
    const area = await makeMapBlock(eupmyeondong);
    res.status(200).json(area);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/labelname', async (req, res, next) => {
  try {
    const labelName = await makeLabel();
    res.status(200).json(labelName);
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

module.exports = { name: '/', router };
