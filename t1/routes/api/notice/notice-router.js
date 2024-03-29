const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const upload = require('../../../middlewares/multer-mw');
const {
  saveNotice,
  findLists,
  listsCount,
  findList,
  findFile,
  deleteList,
  updateList,
  deleteImg,
} = require('../../../models/notice/Notice');

router.get('/deleteimg', async (req, res, next) => {
  try {
    const { idx, col } = req.query;
    const rs = await deleteImg(idx, col);
    rs.affectedRows === 1 ? res.status(200).redirect('/notice') : next(err);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/download', async (req, res, next) => {
  try {
    const { idx, col } = req.query;
    const file = await findFile(idx, col);
    let fileArr = Object.values(file)[0].split('_');
    res
      .status(200)
      .download(
        't1/storages/' +
          fileArr[1].substring(0, 4) +
          '/' +
          fileArr[1].substring(0, 6) +
          '/' +
          fileArr[1].substring(0, 8) +
          '/' +
          file[`${col}`],
        file[`${col}_oriname`]
      );
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/findlist', async (req, res, next) => {
  try {
    const { idx } = req.query;
    const list = await findList(idx);
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/listscount', async (req, res, next) => {
  try {
    const count = await listsCount();
    res.status(200).json(count);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { page, title, contents } = req.query;
    let startIdx = (page - 1) * 20;
    const lists = await findLists(startIdx, title, contents);
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post(
  '/',
  upload.fields([
    { name: 'photo1' },
    { name: 'photo2' },
    { name: 'photo3' },
    { name: 'photo4' },
    { name: 'photo5' },
    { name: 'attached_file1' },
    { name: 'attached_file2' },
  ]),
  async (req, res, next) => {
    try {
      if (req.body.update === 'true') {
        const rs = await updateList(req.body, req.files);
        rs.affectedRows === 1 ? res.status(200).redirect('/notice') : next(err);
      } else {
        const rs = await saveNotice(req.body, req.files);
        rs.affectedRows === 1 ? res.status(200).redirect('/notice') : next(err);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.delete('/', async (req, res, next) => {
  try {
    const { idx } = req.query;
    const rs = await deleteList(idx);
    res.status(200).json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
