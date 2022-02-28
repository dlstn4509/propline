const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');

router.get('/', async (req, res, next) => {
  try {
    const { id } = req.query;
    res.status(200).send(id);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
