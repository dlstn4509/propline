const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { mainNoticeLists, ss } = require('../../../models/main/Main');

router.get('/notice', async (req, res, next) => {
  try {
    const lists = await mainNoticeLists();
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/aaa', async (req, res, next) => {
  try {
    const lists = await ss();
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
