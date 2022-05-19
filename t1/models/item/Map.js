const { pool } = require('../../modules/mysql-md');

const makeMapBlock = async () => {
  try {
    let sql = `
      SELECT blockcode, sido, sigungu, eupmyeondong, latlng_list FROM c011_mapblock
    `;
    const [area] = await pool.execute(sql);
    for (let v of area) {
      let arr = v.latlng_list.substring(1, v.latlng_list.length).split('|');
      let arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        arr2.push([Number(arr[i].split(',')[0]), Number(arr[i].split(',')[1])]);
      }
      v.latlng_list = arr2;
    }
    return area;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const makeLabel = async () => {
  try {
    let sql = `
      SELECT sido, sigungu, eupmyeondong, latitude, longitude, blockcode_list
      FROM c002_legal_dong_code
      WHERE sido='서울'
    `;
    const [labelName] = await pool.execute(sql);
    return labelName;
  } catch (err) {
    throw new Error(err);
  }
};

const findBlockCode = async (blockcode) => {
  try {
    let blockcodeArr = blockcode.split(',');
    let sql = `
      SELECT blockcode, latlng_list  FROM c011_mapblock
      WHERE blockcode='${blockcodeArr[0]}'
    `;
    for (let i = 1; i < blockcodeArr.length; i++) {
      sql += ` OR blockcode='${blockcodeArr[i]}' `;
    }
    const [data] = await pool.execute(sql);

    let latlng_list = [];
    for (let v of data) {
      let arr = v.latlng_list.substring(1, v.latlng_list.length).split('|');
      let arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        arr2.push([Number(arr[i].split(',')[0]), Number(arr[i].split(',')[1])]);
      }
      latlng_list.push({ blockcode: v.blockcode, path: arr2 });
    }

    return latlng_list;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { makeMapBlock, makeLabel, findBlockCode };
