const path = require('path');
const express = require('express');
const router = express.Router();

const {
  saveComment,
  deleteComment,
  saveReComment,
  updateReComment,
  likeComment,
} = require('../../../models/board/Comment');

router.post('/recomment', async (req, res, next) => {
  try {
    let { content, writer, id, board_id } = req.body;
    const rs = await saveReComment(content, writer, id, board_id);
    if (rs.affectedRows === 1) {
      // res.status(200).json(rs);
      res.status(200).redirect(`http://localhost:3000/board/view/${board_id}`);
    } else {
      next(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/recomment', async (req, res, next) => {
  try {
    const rs = await updateReComment(req.body);
    res.status(200).json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/likecomment', async (req, res, next) => {
  try {
    const { id, heartColor } = req.query;
    const rs = await likeComment(id, heartColor);
    res.status(200).json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    let { id } = req.body;
    const rs = await saveComment(req.body);
    if (rs.affectedRows === 1) {
      // res.status(200).json(rs);
      res.status(200).redirect(`http://localhost:3000/board/view/${id}`);
    } else {
      next(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const { id, depth, seq } = req.query;
    const rs = await deleteComment(id, depth, seq);
    res.status(200).json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/comment', router };
