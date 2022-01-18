/************* global require *************/
const express = require('express');
const app = express();
const path = require('path');
const vhost = require('vhost');
require('dotenv').config();

/*************** server init **************/
// require('./modules/server-init')(app, process.env.PORT);
require('./modules/server-init')(app);

/*************** static init **************/
// app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/*************** middleware ***************/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*************** router init **************/
const t1 = require('./t1/app');
const t2 = require('./t2/app');

app.use(vhost('t1.propline.co.kr', t1));
app.use(vhost('t2.propline.co.kr', t2));
