const { pool } = require('../../modules/mysql-md');
const bcrypt = require('bcrypt');

const login = async (query) => {
  try {
    const { id, password } = query;
    let sql = `
      SELECT * FROM m001_member
      WHERE member_id='${id}'
    `;
    const [data] = await pool.execute(sql);
    if (data.length === 0) {
      return { user: null, success: false };
    }
    let compare = await bcrypt.compare(password + process.env.BCRYPT_SALT, data[0].member_pw);
    return compare ? { user: data[0], success: true } : { user: null, success: false };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { login };
