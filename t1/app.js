const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const method = require('./middlewares/method-mw');
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
app.use(method());

/*************** router init **************/
// const apiMapRouter = require('./routes/api/map');
// const apiBuildingRouter = require('./routes/api/buildingInfo');
// const apiBoardRouter = require('./routes/api/board');
// const apiTestRouter = require('./routes/api/test');
// app.use('/api/map', apiMapRouter);
// app.use('/api/buildinginfo', apiBuildingRouter);
// app.use('/api/board', apiBoardRouter);
// app.use('/api/test', apiTestRouter);
const signUpRouter = require('./routes/api/signup');
app.use('/api/signup', signUpRouter);

/*************** vue init **************/
let paths = ['/main', '/login', '/signup', '/mapsslice', '/businesssignup', '/normalsignup'];
app.get(paths, function (req, res, next) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

module.exports = app;
