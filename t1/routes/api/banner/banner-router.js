const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { findBannerLists, findBanner } = require('../../../models/banner/Banner');

router.get('/bannerpage', async (req, res, next) => {
  try {
    const { idx } = req.query;
    const banner = await findBanner(idx);
    res.status(200).json(banner);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const bannerLists = await findBannerLists();
    res.status(200).json(bannerLists);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
