const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { alert } = require('../../../modules/util');

router.get('/', (req, res, next) => {
  req.logout();
  res.locals.user = null;
  res.send(alert('로그아웃 되었습니다.', '/admin/login'));
});

module.exports = { name: '/', router };
