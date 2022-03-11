const path = require('path');
const express = require('express');
const router = express.Router();
const { viewBoard } = require('../../../models/board/ViewBoard');

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await viewBoard(id);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/view', router };
