const path = require('path');
const express = require('express');
const router = express.Router();

const createPager = require('../../../modules/pager-init');
const { findLists, findListsCount } = require('../../../models/board/Board');

router.get(['/', '/:page'], async (req, res, next) => {
  try {
    const { count: totalRecord } = await findListsCount();
    const page = Number(req.params.page) || 1;
    const pager = createPager(page, totalRecord);
    const lists = await findLists(pager.startIdx.toString(), pager.listCnt.toString());
    res.json({ lists, pager });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
