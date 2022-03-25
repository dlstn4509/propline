const { pool } = require('../../modules/mysql-md');
const bcrypt = require('bcrypt');
const moment = require('moment');

const login = async (query) => {
  try {
    const { id, password, loginIp } = query;
    let now = moment().format('YYYY-MM-DD HH:mm:ss');
    let sql = `
      SELECT M.*, C.* FROM m001_member AS M
      LEFT JOIN m002_company AS C ON M.cidx = C.cidx
      WHERE M.member_id='${id}'
    `;
    const [data] = await pool.execute(sql);
    if (data.length === 0) {
      return { user: null, success: false };
    }
    let compare = await bcrypt.compare(password + process.env.BCRYPT_SALT, data[0].member_pw);
    if (compare) {
      let sql = `
        UPDATE m001_member 
        SET last_login_ip='${loginIp}', last_login_date='${now}'
        WHERE member_id='${id}'
      `;
      await pool.execute(sql);
      return { user: data[0], success: true };
    } else {
      return { user: null, success: false };
    }
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { login };
