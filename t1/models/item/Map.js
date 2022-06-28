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

const makeDongList = async () => {
  try {
    let sql = `
      SELECT sido, sigungu, eupmyeondong, latitude, longitude, blockcode_list
      FROM c002_legal_dong_code
      WHERE sido='서울' AND LENGTH(eupmyeondong) > 0
    `;
    const [dongList] = await pool.execute(sql);
    return dongList;
  } catch (err) {
    throw new Error(err);
  }
};

const findBlockCode = async (blockcode) => {
  try {
    let blockcodeArr = blockcode.split(',');
    let sql = `
      SELECT blockcode, eupmyeondong, latlng_list FROM c011_mapblock
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
      latlng_list.push({ blockcode: v.blockcode, eupmyeondong: v.eupmyeondong, path: arr2 });
    }

    return latlng_list;
  } catch (err) {
    throw new Error(err);
  }
};

const makeSubway = async () => {
  try {
    let sql = `
      SELECT line, station, latitude, longitude, is_crossed, blockcode_list
      FROM c003_subway
      WHERE is_hidden=0
    `;
    const [subwayList] = await pool.execute(sql);
    return subwayList;
  } catch (err) {
    throw new Error(err);
  }
};

const makeGu = async () => {
  try {
    let sql = `
      SELECT sido, sigungu, latitude, longitude, blockcode_list
      FROM c002_legal_dong_code
      WHERE sido='서울' AND LENGTH(sigungu) > 0 AND LENGTH(legal_dong)= 0
    `;
    const [gu] = await pool.execute(sql);
    return gu;
  } catch (err) {
    throw new Error(err);
  }
};

const makeSeoul = async () => {
  try {
    let sql = `
      SELECT latlng_list
      FROM c011_mapblock
      WHERE idx='955'
    `;
    const [[seoul]] = await pool.execute(sql);
    let seoulArr = seoul.latlng_list.split('_');
    let arr = [];
    for (let v of seoulArr) {
      arr.push([Number(v.split(',')[0]), Number(v.split(',')[1])]);
    }
    return arr;
  } catch (err) {
    throw new Error(err);
  }
};

const findSigungu = async (sido) => {
  try {
    let sql = `
      SELECT sigungu
      FROM c002_legal_dong_code
      WHERE sido='${sido}' AND legal_dong='' AND eupmyeondong='' AND LENGTH(sigungu) > 0
    `;
    const [sigungu] = await pool.execute(sql);
    sigungu.unshift({ sigungu: `${sido}전체` });
    return sigungu;
  } catch (err) {
    throw new Error(err);
  }
};

const findEupmyeondong = async (sido, sigungu) => {
  try {
    let sql = `
      SELECT DISTINCT(eupmyeondong)
      FROM c002_legal_dong_code
      WHERE sido='${sido}' AND sigungu='${sigungu}' AND LENGTH(eupmyeondong) > 0
    `;
    const [eupmyeondong] = await pool.execute(sql);
    eupmyeondong.unshift({ eupmyeondong: `${sigungu} 전체` });
    return eupmyeondong;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  makeMapBlock,
  makeDongList,
  findBlockCode,
  makeSubway,
  makeGu,
  makeSeoul,
  findSigungu,
  findEupmyeondong,
};
