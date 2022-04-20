const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const uploader = require('../../../middlewares/multer-mw');
const { requestSale } = require('../../../models/requestSale/RequestSale');

router.post('/', uploader.fields([{ name: 'file' }]), async (req, res, next) => {
  try {
    const [rs] = await requestSale(req.body);
    rs.affectedRows === 1 ? res.status(200).redirect('/admin/requestsale') : next(err);
    // res.json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
