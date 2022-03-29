const { pool } = require('../modules/mysql-md');

const findMidx = async (req, res, next) => {
  try {
    sql = `
      SELECT midx AS lastMidx FROM m001_member
      ORDER BY midx DESC
      LIMIT 1
    `;
    const [[{ lastMidx }]] = await pool.execute(sql);
    req.midx = lastMidx + 1;
    next();
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { findMidx };
