const path = require('path');
const express = require('express');
const router = express.Router();

const upload = require('../../../middlewares/multer-mw');
const sharpInit = require('../../../middlewares/sharp-mw');
const makeMp4Init = require('../../../middlewares/makeMp4-mw');
const ffmpegInit = require('../../../middlewares/ffmpeg-mw');
const { saveBoard, saveFile } = require('../../../models/form/SaveBoard');

router.post(
  '/',
  upload.fields([{ name: 'image1' }, { name: 'video1' }]),
  // upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }, { name: 'video1' }]),
  sharpInit(),
  ffmpegInit(),
  makeMp4Init(),

  async (req, res, next) => {
    try {
      const data = await saveBoard(req.body);
      if (req.files && data.affectedRows === 1) {
        for (let [key, [val]] of Object.entries(req.files)) {
          const file = await saveFile(data.insertId, key, val);
          if (file.affectedRows !== 1) {
            return next(err);
          }
        }
      }
      // res.status(200).json(req.files);
      res.status(200).redirect('https://t1.propline.co.kr/form');
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = { name: '/save', router };
