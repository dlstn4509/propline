const { pool } = require('../../modules/mysql-md');

const makeCate = async (sido, sigungu, dong) => {
  try {
    let sql = '';
    if (sido && sigungu && dong) {
      sql = `SELECT item_type
              FROM maps2
              WHERE sido='${sido}' AND sigungu='${sigungu}' AND dong='${dong}'
              GROUP BY item_type `;
    } else if (sido && sigungu) {
      sql = `SELECT dong
              FROM maps2
              WHERE sido='${sido}' AND sigungu='${sigungu}'
              GROUP BY dong `;
    } else if (sido) {
      sql = `SELECT sigungu
              FROM maps2
              WHERE sido='${sido}'
              GROUP BY sigungu `;
    } else {
      sql = `SELECT sido
              FROM maps2
              GROUP BY sido
      `;
    }
    const [cate] = await pool.execute(sql);
    return { cate };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { makeCate };
