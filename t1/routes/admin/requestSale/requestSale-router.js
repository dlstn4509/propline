const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const createPager = require('../../../modules/pager-init');
const {
  findLists,
  findListsCount,
  findList,
  updateList,
  deleteList,
} = require('../../../models/admin/requestSale/RequestSale');

router.get('/search', async (req, res, next) => {
  try {
    res.json(req.body);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    req.app.locals.css = 'admin-requestSale';
    req.app.locals.js = 'admin-requestSale';
    req.app.locals.menuType = '/admin/requestsale?';
    if (Object.entries(req.query).length) {
      for (let [key, val] of Object.entries(req.query)) {
        if (key !== 'page') {
          req.app.locals.menuType += `${key}=${val}&`;
        }
      }
    }
    if (req.query.view) {
      const { view } = req.query;
      const list = await findList(view);
      res.render('requestSale/view', { list });
    } else {
      const { count: totalRecord } = await findListsCount(req.query);
      const page = Number(req.query.page || 1);
      const pager = createPager(page, totalRecord, 15, 10);
      const lists = await findLists(pager.startIdx, pager.listCnt, req.query);
      res.render('requestSale/lists', { lists, pager, totalRecord, query: req.query });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const rs = await updateList(req.body);
    rs.affectedRows === 1 ? res.status(200).redirect('/admin/requestsale') : next(err);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const rs = await deleteList(req.body.idx);
    res.status(200).json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
