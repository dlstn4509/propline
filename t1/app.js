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
// app.use((req, res, next) => {
//   let url = req.originalUrl.split('/')[1];
//   console.log(url);
//   if (url !== 'css' && url !== 'js' && url !== 'favicon.ico') {
//     app.use('/' + url, require('./routes/' + url));
//   }
//   next();
// });

const aboutRouter = require('./routes/about');
const kakaoMapRouter = require('./routes/kakaomap');
const mainRouter = require('./routes/main');

app.use('/about', aboutRouter);
app.use('/kakaomap', kakaoMapRouter);
app.use('/main', mainRouter);

module.exports = app;
