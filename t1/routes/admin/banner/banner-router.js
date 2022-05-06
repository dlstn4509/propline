const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const upload = require('../../../middlewares/multer-mw');
const {
  saveBanner,
  findLists,
  findList,
  updateThumb,
  updateBanner,
} = require('../../../models/admin/banner/Banner');

router.get('/updatethumb', async (req, res, next) => {
  try {
    let { idx, path } = req.query;
    const rs = await updateThumb(idx, path);
    res.json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/', async (req, res, next) => {
  try {
    let { type } = req.query;
    req.app.locals.css = 'admin-banner';
    req.app.locals.js = 'admin-banner';
    let { idx } = req.query;
    if (type === 'form') {
      res.render('banner/form', { user: req.user });
    } else if (idx) {
      // update
      const list = await findList(idx);
      res.render('banner/update', { user: req.user, list });
    } else {
      const lists = await findLists();
      req.app.locals.js = '';
      res.render('banner/list', { user: req.user, lists });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', upload.any(), async (req, res, next) => {
  try {
    let { type } = req.body;
    if (type === 'update') {
      const rs = await updateBanner(req.body, req.files);
      rs.affectedRows === 1 ? res.status(200).redirect('/admin/banner') : next(err);
    } else {
      const rs = await saveBanner(req.body, req.files);
      rs.affectedRows === 1 ? res.status(200).redirect('/admin/banner') : next(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
