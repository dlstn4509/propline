const { pool } = require('../../modules/mysql-md');
const moment = require('moment');

const mainNoticeLists = async () => {
  try {
    let sql = `
      SELECT idx, title, mod_date
      FROM notice
      ORDER BY mod_date DESC
      LIMIT 0, 5
    `;
    const [lists] = await pool.execute(sql);
    for (let v of lists) {
      v.isNew = moment().subtract(3, 'days').format('YYYY-MM-DD') <= moment(v.mod_date).format('YYYY-MM-DD');
    }
    return lists;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { mainNoticeLists };
