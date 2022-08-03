const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

/*************** static init **************/
app.use('/', express.static(path.join(__dirname, 'public')));

/************** view engine ***************/
app.set('view engine', 'ejs');
app.set('views', './t1/views');
app.locals.pretty = true;

/*************** router init **************/
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

module.exports = app;
