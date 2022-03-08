const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { viewBoard, saveComment, deleteComment } = require('../../../models/board/ViewBoard');

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await viewBoard(id);
    res.status(200).json(data);
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

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const rs = await deleteComment(id);
    res.status(200).json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/view', router };
