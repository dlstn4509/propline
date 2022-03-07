const axios = require('axios');
const { pool } = require('../../modules/mysql-md');

const findListsCount = async () => {
  try {
    let sql = `
      SELECT COUNT(id) AS count FROM board
    `;
    const [[data]] = await pool.execute(sql);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const findLists = async (startIdx, listCnt) => {
  try {
    let sql = `
      SELECT B.*, BF.mimetype FROM board AS B
      LEFT JOIN boardfile AS BF ON b.id = BF.board_id
      GROUP BY B.id
      ORDER BY B.id DESC
      LIMIT ?, ?
    `;
    const [lists] = await pool.execute(sql, [startIdx, listCnt]);
    return lists;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { findListsCount, findLists };
