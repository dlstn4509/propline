const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');

router.get('/', (req, res, next) => {
  // req.app.locals.css = 'admin-login';
  res.render('main/main', { user: req.user });
  // res.json(req.user);
});

module.exports = { name: '/', router };

/* 
<%- include('../inc/head.ejs') %>
<div class="flex-div">
  <%- include('../inc/nav.ejs') %>
  <div class="container-wrapper">asd</div>
</div>
<%- include('../inc/foot.ejs') %>
*/
