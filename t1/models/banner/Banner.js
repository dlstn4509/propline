const axios = require('axios');
const { pool } = require('../../modules/mysql-md');
const moment = require('moment');

const findBannerLists = async () => {
  try {
    let sql = `
      SELECT * FROM banner
      WHERE is_on='2' AND end_date >= '${moment().format('YYYY-MM-DD')}'
    `;
    const [banner] = await pool.execute(sql);
    for (let v of banner) {
      v.bannerSrc = 'uploads/' + v.banner_image.substring(10, v.banner_image.length);
      v.start_date = moment(v.start_date).format('YYYY-MM-DD');
      v.end_date = moment(v.end_date).format('YYYY-MM-DD');
    }
    return banner;
  } catch (err) {
    throw new Error(err);
  }
};

const findBanner = async (idx) => {
  try {
    let sql = `
      SELECT * FROM banner
      WHERE idx='${idx}'
    `;
    const [[banner]] = await pool.execute(sql);
    let arr = banner.detail_image.split('^');
    banner.detail_imageArr = [];
    for (let v of arr) {
      v = 'uploads/' + v.substring(10, v.length);
      banner.detail_imageArr.push(v);
    }
    return banner;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { findBannerLists, findBanner };
