const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const {
  saveFindItem,
  findItemLists,
  findItemCount,
  findItemList,
  updateFindItem,
  deleteFindItem,
} = require('../../../models/findItem/FindItem');

router.get('/finditemcount', async (req, res, next) => {
  try {
    const { company_name, title, contents } = req.query;
    const { count } = await findItemCount(company_name, title, contents);
    res.status(200).json(count);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/:idx', async (req, res, next) => {
  try {
    const { idx } = req.params;
    const rs = await findItemList(idx);
    res.status(200).json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/', async (req, res, next) => {
  try {
    const { page, company_name, title, contents } = req.query;
    let startIdx = (page - 1) * 20;
    const lists = await findItemLists(startIdx, company_name, title, contents);
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post('/', async (req, res, next) => {
  try {
    const { success } = await saveFindItem(req.body);
    success ? res.redirect('/finditem') : next(err);
    // res.json(success);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put('/', async (req, res, next) => {
  try {
    const { success } = await updateFindItem(req.body);
    success ? res.redirect('/finditem') : next(err);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.delete('/', async (req, res, next) => {
  try {
    const { idx } = req.body;
    const { success } = await deleteFindItem(idx);
    success ? res.redirect('/finditem') : next(err);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
