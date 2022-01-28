const path = require('path');
const multer = require('multer');
const moment = require('moment');
const fs = require('fs-extra');
const { v4: uuid } = require('uuid');

// 폴더 만들기 (ensureDir)
const destination = async (req, file, cb) => {
  try {
    let folder = '';
    if (file.mimetype.split('/')[0] === 'image') {
      folder = path.join(__dirname, '../storages/image', moment().format('YYMMDD'));
    } else {
      folder = path.join(__dirname, '../storages/video', moment().format('YYMMDD'));
    }
    await fs.ensureDir(folder);
    cb(null, folder);
  } catch (err) {
    cb(err);
  }
};

const filename = (req, file, cb) => {
  try {
    const ext = path.extname(file.originalname).toLowerCase(); //.jpg
    const filename = moment().format('YYMMDD') + '_' + uuid() + ext;
    cb(null, filename);
  } catch (err) {
    cb(err);
  }
};

const storage = multer.diskStorage({ destination, filename });

module.exports = multer({ storage });
