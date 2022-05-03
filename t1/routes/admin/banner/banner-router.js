const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const upload = require('../../../middlewares/multer-mw');
const { saveBanner } = require('../../../models/admin/banner/Banner');

router.get('/', (req, res, next) => {
  req.app.locals.css = 'admin-banner';
  req.app.locals.js = 'admin-banner';
  res.render('banner/banner', { user: req.user });
});

router.post(
  '/',
  upload.fields([
    { name: 'banner_image' },
    { name: 'thumbImg01' },
    { name: 'thumbImg02' },
    { name: 'thumbImg03' },
    { name: 'thumbImg04' },
    { name: 'thumbImg05' },
  ]),
  async (req, res, next) => {
    const rs = await saveBanner(req.body, req.files);
    res.json(rs);
  }
);

module.exports = { name: '/', router };
