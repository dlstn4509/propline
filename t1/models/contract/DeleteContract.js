const { pool } = require('../../modules/mysql-md');

const deleteContract = async (idx) => {
  try {
    let sql = `
      DELETE FROM contract
      WHERE idx=${idx}
    `;
    const [rs] = await pool.execute(sql);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { deleteContract };
