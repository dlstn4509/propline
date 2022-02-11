const { pool } = require('../../modules/mysql-md');

const findHome = async (item_no) => {
  let sql = '';
  try {
    let data = [];
    sql = `
    SELECT *
    FROM maps2
    WHERE item_no=${item_no}
    `;
    const [[home]] = await pool.execute(sql);

    sql = `
    SELECT *
    FROM maps2file
    WHERE maps2_item_no=${item_no}
    `;
    const [file] = await pool.execute(sql);

    data.push(home, file);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { findHome };
