const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const ffmpegInit = require('../../../middlewares/ffmpeg-mw');
const sharpInit = require('../../../middlewares/sharp-mw');
const upload = require('../../../middlewares/multer-mw');
const makeMp4Init = require('../../../middlewares/makeMp4-mw');
const { saveHome, saveFile } = require('../../../models/form/SaveHome');

router.post(
  '/',
  upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'video1' }]),
  sharpInit(),
  makeMp4Init(),
  ffmpegInit(),
  async (req, res, next) => {
    try {
      let {
        sido,
        sigungu,
        dong,
        bun,
        ji,
        lat,
        lng,
        item_type,
        trade_type,
        price,
        deposit,
        rent,
        mfee,
        bcode,
      } = req.body;
      const data = await saveHome(
        sido,
        sigungu,
        dong,
        bun,
        ji,
        lat,
        lng,
        item_type,
        trade_type,
        price,
        deposit,
        rent,
        mfee,
        bcode
      );
      for (let [key, [val]] of Object.entries(req.files)) {
        const file = await saveFile(data.insertId, key, val);
        if (file.affectedRows !== 1) {
          return next(err);
        }
      }
      // res.json(req.files);
      res.status(200).redirect('https://t1.propline.co.kr/form');
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = { name: '/save', router };
