/************* global require *************/
const express = require('express');
const app = express();
const path = require('path');
const vhost = require('vhost');
const vhttps = require('vhttps');
const cors = require('cors');
const fs = require('fs');
// const cookieParser = require('cookie-parser');
const server = vhttps.init();
require('dotenv').config();

/*************** static init **************/
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/*************** middleware ***************/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.use(vueHistory());

/*************** cookie ***************/
// app.use(cookieParser());

/*************** router init **************/
let options = {
  t1Key: {
    key: fs.readFileSync('./auth/t1.propline.co.kr-key.pem'),
    cert: fs.readFileSync('./auth/t1.propline.co.kr-crt.pem'),
    passphrase: process.env.AUTH_PASS,
  },
};

/*************** t1 **************/
// app.use(
//   vhost('t1.propline.co.kr', (req, res, next) => {
//     if (req.secure) {
//       next();
//     } else {
//       return res.redirect('https://' + req.headers.host + req.url);
//     }
//   })
// );

const t1 = require('./t1/app');
app.use(vhost('t1.propline.co.kr', t1)); // http도 접속 허용
server.use('t1.propline.co.kr', options.t1Key, t1);

/*************** t2 **************/
// const t2 = require('./t2/app');
// app.use(vhost('t2.propline.co.kr', t2));
/*************** t3 **************/
const t3 = require('./t3/app');
app.use(vhost('t3.propline.co.kr', t3));
/*************** t4 **************/
const t4 = require('./t4/app');
app.use(vhost('t4.propline.co.kr', t4));

/*************** server init **************/
require('./modules/server-init')(app, server);
