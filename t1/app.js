require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const method = require('./middlewares/method-mw');
const session = require('./middlewares/session-mw');
const locals = require('./middlewares/locals-mw');
const navCount = require('./middlewares/navCount-mw');
const passport = require('passport');
const passportModule = require('./passport');

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
app.use(session(app));

/**************** passport ****************/ // 패스포트 세팅 무조건 넣음
passportModule(passport);
app.use(passport.initialize());
app.use(passport.session());

/***************** locals *****************/
app.use(locals);

app.use(navCount);

/*************** router init **************/
// const apiMapRouter = require('./routes/api/map');
// const apiBuildingRouter = require('./routes/api/buildingInfo');
// const apiBoardRouter = require('./routes/api/board');
// const apiTestRouter = require('./routes/api/test');
// app.use('/api/map', apiMapRouter);
// app.use('/api/buildinginfo', apiBuildingRouter);
// app.use('/api/board', apiBoardRouter);
// app.use('/api/test', apiTestRouter);
const isUserRouter = require('./routes/api/isuser');
app.use('/api/isuser', isUserRouter);
const signUpRouter = require('./routes/api/signup');
app.use('/api/signup', signUpRouter);
const loginRouter = require('./routes/api/login');
app.use('/api/login', loginRouter);
const findItemRouter = require('./routes/api/findItem');
app.use('/api/finditem', findItemRouter);
const logOutRouter = require('./routes/api/logout');
app.use('/api/logout', logOutRouter);
const requestSaleRouter = require('./routes/api/requestSale');
app.use('/api/requestsale', requestSaleRouter);
const requestRouter = require('./routes/api/request');
app.use('/api/request', requestRouter);
const noticeRouter = require('./routes/api/notice');
app.use('/api/notice', noticeRouter);
const freeBoardRouter = require('./routes/api/freeBoard');
app.use('/api/freeboard', freeBoardRouter);

const adminLoginRouter = require('./routes/admin/login');
app.use('/admin/login', adminLoginRouter);
const adminSignUpRouter = require('./routes/admin/signUp');
app.use('/admin/signup', adminSignUpRouter);
const adminMainRouter = require('./routes/admin/main');
app.use('/admin/main', adminMainRouter);
const adminRequestSaleRouter = require('./routes/admin/requestSale');
app.use('/admin/requestsale', adminRequestSaleRouter);
const adminBannerRouter = require('./routes/admin/banner');
app.use('/admin/banner', adminBannerRouter);

/*************** vue init **************/
let paths = [
  '/main',
  '/login',
  '/signup',
  '/businesssignup',
  '/normalsignup',
  '/item',
  '/itempublic',
  '/saleinfo',
  '/finditem',
  '/saleitem',
  '/request',
  '/freeboard',
  '/knowhow',
  '/recruit',
  '/consult',
  '/direct',
  '/notice',
  '/question',
  '/requestboard',
  '/inquiry',
  '/event',
  '/serviceintro',
  '/charge',
  '/mobileapp',
  '/card',
  '/extra',
  '/gpoint',
  '/paymenthistory',
  '/requestsale',
  '/manual',
];
app.get(paths, (req, res, next) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

module.exports = app;
