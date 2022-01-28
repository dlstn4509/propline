const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

/*************** static init **************/
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'storages')));

/************** view engine ***************/
app.set('view engine', 'ejs');
app.set('views', './t1/views');
app.locals.pretty = true;

/*************** middleware ***************/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*************** router init **************/
const apiMapRouter = require('./routes/api/map');
const apiFormRouter = require('./routes/api/form');
app.use('/api/map', apiMapRouter);
app.use('/api/form', apiFormRouter);

/*************** vue init **************/
let paths = ['/main', '/about', '/maps', '/form'];
app.get(paths, function (req, res, next) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

module.exports = app;
