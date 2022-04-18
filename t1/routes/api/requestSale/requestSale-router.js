const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const uploader = require('../../../middlewares/multer-mw');
const { requestSale } = require('../../../models/requestSale/RequestSale');

router.post('/', uploader.fields([{ name: 'file' }]), async (req, res, next) => {
  try {
    // console.log(req.files);
    const [rs] = await requestSale(req.body);
    // res.json(req.body);
    rs.affectedRows === 1 ? res.status(200).redirect('http://localhost:3000/requestsale') : next(err);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
