const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const sharpInit = require('../../../middlewares/sharp-mw');
const upload = require('../../../middlewares/multer-mw');
const { saveHome, saveFile } = require('../../../models/form/SaveHome');

router.post(
  '/',
  upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'video1' }]),
  sharpInit(),
  async (req, res, next) => {
    try {
      let { sido, sigungu, dong, lat, lng, item_type, trade_type, price, deposit, rent, mfee } =
        req.body;
      const data = await saveHome(
        sido,
        sigungu,
        dong,
        lat,
        lng,
        item_type,
        trade_type,
        price,
        deposit,
        rent,
        mfee
      );
      for (let [key, [val]] of Object.entries(req.files)) {
        const file = await saveFile(data.insertId, key, val);
        if (file.affectedRows !== 1) {
          return next(err);
        }
      }
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = { name: '/save', router };
