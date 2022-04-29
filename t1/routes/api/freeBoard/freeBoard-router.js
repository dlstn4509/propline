const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const upload = require('../../../middlewares/multer-mw');
const {
  saveFreeBoard,
  findLists,
  findList,
  listsCount,
  deleteImg,
  updateList,
} = require('../../../models/freeBoard/FreeBoard');

router.get('/deleteimg', async (req, res, next) => {
  try {
    const { idx, col } = req.query;
    const rs = await deleteImg(idx, col);
    rs.affectedRows === 1 ? res.status(200).redirect('/notice') : next(err);
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

router.get('/findlist', async (req, res, next) => {
  try {
    const { idx } = req.query;
    const list = await findList(idx);
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { page } = req.query;
    let startIdx = (page - 1) * 20;
    const lists = await findLists(startIdx);
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
        const { success } = await updateList(req.body, req.files);
        success ? res.status(200).redirect('/freeboard') : alert('실패');
      } else {
        const rs = await saveFreeBoard(req.body, req.files);
        rs.affectedRows === 1 ? res.status(200).redirect('/freeboard') : next(err);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = { name: '/', router };
