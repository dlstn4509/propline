const { pool } = require('../../modules/mysql-md');

const findAllMap = async (top, bottom, left, right, limit, sido, sigungu, dong, item_type) => {
  try {
    let sql = `
    SELECT *
    FROM maps
    WHERE
    lat < ${top} AND
    lat > ${bottom} AND
    lng > ${left} AND
    lng < ${right} AND
    sido LIKE '${sido}' AND
    sigungu LIKE '${sigungu}' AND
    dong LIKE '${dong}' AND
    item_type LIKE '${item_type}'
    `;
    if (limit) {
      sql += `LIMIT ${limit}`;
    }
    const [maps] = await pool.execute(sql);
    return { maps };
  } catch (err) {
    throw new Error(err);
  }
};

const makeMarker = async (top, bottom, left, right, sido, sigungu, dong, item_type) => {
  try {
    let sql = `
    SELECT *
    FROM maps
    WHERE
    lat < ${top} - 0.001 AND
    lat > ${bottom} - 0.001 AND
    lng > ${left} - 0.001 AND
    lng < ${right} - 0.001 AND
    sido LIKE '${sido}' AND
    sigungu LIKE '${sigungu}' AND
    dong LIKE '${dong}' AND
    item_type LIKE '${item_type}'
    `;
    const [rs] = await pool.execute(sql);
    return { rs };
  } catch (err) {
    throw new Error(err);
  }
};

const findCenter = async (sido, sigungu, dong, item_type) => {
  try {
    let sql = `
    SELECT lat, lng, price, deposit, rent, mfee
    FROM maps
    WHERE
    sido LIKE '${sido}' AND
    sigungu LIKE '${sigungu}' AND
    dong LIKE '${dong}' AND
    item_type LIKE '${item_type}'
    `;
    const [rs] = await pool.execute(sql);
    return { rs };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { findAllMap, makeMarker, findCenter };
