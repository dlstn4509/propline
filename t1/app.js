const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
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
app.use(cors());

/*************** router init **************/
const apiMapRouter = require('./routes/api/map');
const apiFormRouter = require('./routes/api/form');
const apiBuildingRouter = require('./routes/api/buildingInfo');
const apiBoardRouter = require('./routes/api/board');
// const apiTestRouter = require('./routes/api/test');
app.use('/api/map', apiMapRouter);
app.use('/api/form', apiFormRouter);
app.use('/api/buildinginfo', apiBuildingRouter);
app.use('/api/board', apiBoardRouter);
// app.use('/api/test', apiTestRouter);

/*************** vue init **************/
let paths = ['/main', '/about', '/maps', '/buildinginfo', '/board', '/form'];
app.get(paths, function (req, res, next) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

module.exports = app;
