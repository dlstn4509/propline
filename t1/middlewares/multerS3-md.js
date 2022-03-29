const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const moment = require('moment');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      // let midx = '1111';
      let { midx } = req;
      let newFileName =
        `m002_${midx}_` +
        moment().format('YYYYMMDDHHmmss') +
        moment().milliseconds() +
        file.originalname.split('.').pop();
      let fullPath = `upload/${moment().format('YYYY')}/${moment().format('YYYYMM')}/${moment().format(
        'YYYYMMDD'
      )}/${newFileName}`;
      // let fullPath =
      //   'upload/' +
      //   moment().format('YYYY') +
      //   '/' +
      //   moment().format('YYYYMM') +
      //   '/' +
      //   moment().format('YYYYMMDD') +
      //   '/' +
      //   newFileName;
      cb(null, fullPath);
    },
  }),
  acl: 'public-read-write', // 'public-read-write'
});

module.exports = uploadS3;
