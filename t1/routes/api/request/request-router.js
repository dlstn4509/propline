const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const {
  findLists,
  listsCount,
  findList,
  deleteList,
  checkPhoneNum,
  isLog,
  readingCompany,
} = require('../../../models/request/Request');

router.get('/readingcompany', async (req, res, next) => {
  try {
    const { iar_idx } = req.query;
    const data = await readingCompany(iar_idx);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/islog', async (req, res, next) => {
  try {
    const { iar_idx, cidx } = req.query;
    const iar_idxs = await isLog(iar_idx, cidx);
    res.status(200).json(iar_idxs);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/checkphonenum', async (req, res, next) => {
  try {
    const { idx, midx, cidx } = req.query;
    const phoneNum = await checkPhoneNum(idx, midx, cidx);
    res.status(200).json(phoneNum);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/findlist', async (req, res, next) => {
  try {
    const { idx } = req.query;
    const list = await findList(idx);
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/listscount', async (req, res, next) => {
  try {
    const { isRequest, item_kind, searchTxt } = req.query;
    const count = await listsCount(isRequest, item_kind, searchTxt);
    res.status(200).json(count);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/', async (req, res, next) => {
  try {
    const { page, isRequest, item_kind, searchTxt } = req.query;
    let startIdx = (page - 1) * 20;
    const lists = await findLists(startIdx, isRequest, item_kind, searchTxt);
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.delete('/', async (req, res, next) => {
  try {
    const { idx } = req.body;
    const { success } = await deleteList(idx);
    success ? res.redirect('/request') : next(err);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
