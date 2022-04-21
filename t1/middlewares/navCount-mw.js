const { pool } = require('../modules/mysql-md');

module.exports = async (req, res, next) => {
  try {
    let sql = `
      SELECT COUNT(idx) AS requestsale FROM item_ad_request WHERE record_state=0
    `;
    const [[{ requestsale }]] = await pool.execute(sql);
    req.app.locals.requestsale = requestsale;
    next();
  } catch (err) {
    next(err);
  }
};
