const path = require('path');
const express = require('express');
const router = express.Router();

const upload = require('../../../middlewares/multer-mw');
const sharpInit = require('../../../middlewares/sharp-mw');
const makeMp4Init = require('../../../middlewares/makeMp4-mw');
const ffmpegInit = require('../../../middlewares/ffmpeg-mw');
const { saveBoard, saveFile, updateBoard, updateFile } = require('../../../models/board/SaveBoard');

router.post(
  '/',
  upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }, { name: 'video1' }]),
  sharpInit(),
  ffmpegInit(),
  makeMp4Init(),
  async (req, res, next) => {
    try {
      if (req.body._method !== 'PUT') {
        const data = await saveBoard(req.body);
        if (req.files && data.affectedRows === 1) {
          for (let [key, [val]] of Object.entries(req.files)) {
            const file = await saveFile(data.insertId, key, val);
            if (file.affectedRows !== 1) {
              return next(err);
            }
          }
        }
        if (data.affectedRows === 1) {
          // res.status(200).json(data);
          // res.status(200).redirect('https://t1.propline.co.kr/board/form');
          res.status(200).redirect('http://localhost:3000/board');
        } else {
          next(err);
        }
      } else {
        const data = await updateBoard(req.body);
        if (req.files && data.affectedRows === 1) {
          for (let [key, [val]] of Object.entries(req.files)) {
            const file = await updateFile(key, val, req.body.id);
            if (file.affectedRows !== 1) {
              return next(err);
            }
          }
        }
        if (data.affectedRows === 1) {
          // res.status(200).json(data);
          // res.status(200).redirect('https://t1.propline.co.kr/board/form');
          res.status(200).redirect('http://localhost:3000/board');
        } else {
          next(err);
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = { name: '/save', router };
