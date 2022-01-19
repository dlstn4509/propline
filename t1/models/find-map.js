const { pool } = require('../modules/mysql-init');

const findAllMap = async (top, bottom, left, right, limit) => {
  try {
    let sql = `
    SELECT * FROM maps 
    WHERE
    lat < ${top} AND
    lat > ${bottom} AND
    lng > ${left} AND
    lng < ${right}
    LIMIT ${limit}
    `;
    const [maps] = await pool.execute(sql);
    return { maps };
  } catch (err) {
    throw new Error(err);
  }
};

const findAllMapCnt = async (top, bottom, left, right) => {
  try {
    let sql = `
    SELECT * FROM maps 
    WHERE
    lat < ${top} AND
    lat > ${bottom} AND
    lng > ${left} AND
    lng < ${right}
    `;
    const [mapsCnt] = await pool.execute(sql);
    return { mapsCnt };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { findAllMap, findAllMapCnt };
