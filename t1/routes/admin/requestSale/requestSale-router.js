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
} = require('../../../models/admin/requestSale/RequestSale');

router.get('/', async (req, res, next) => {
  try {
    req.app.locals.css = 'admin-requestSale';
    req.app.locals.menuType = 'requestsale';
    if (req.query.view) {
      const { view } = req.query;
      const list = await findList(view);
      res.render('requestSale/view', { list });
    } else {
      const { count: totalRecord } = await findListsCount();
      const page = Number(req.query.page || 1);
      const pager = createPager(page, totalRecord, 15, 10);
      const lists = await findLists(pager.startIdx, pager.listCnt);
      res.render('requestSale/lists', { lists, pager, totalRecord });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const rs = await updateList(req.body);
    // res.status(200).json(rs);
    rs.affectedRows === 1 ? res.status(200).redirect('/admin/requestsale') : next(err);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
