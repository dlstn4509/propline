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

/*************** middleware ***************/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*************** router init **************/
const apiMapRouter = require('./routes/api/map');
app.use('/api/map', apiMapRouter);

/*************** vue init **************/
app.get('/*', function (req, res, next) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

module.exports = app;
