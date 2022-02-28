const { pool } = require('../../modules/mysql-md');

const searchMap = async (lat, lng) => {
  try {
    let sql = `
    SELECT lat, lng
    FROM maps
    WHERE lat=${lat} AND lng=${lng}
    `;
    const data = await pool.execute(sql);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { searchMap };
