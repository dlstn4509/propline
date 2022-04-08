const { pool } = require('../../modules/mysql-md');
const bcrypt = require('bcrypt');
const moment = require('moment');

const login = async (member_id, member_pw) => {
  let sql, compare;
  try {
    sql = ' SELECT * FROM m001_member WHERE member_id=?  ';
    const [r] = await pool.execute(sql, [member_id]);
    if (r.length === 1) {
      compare = await bcrypt.compare(member_pw + process.env.BCRYPT_SALT, r[0].member_pw);
      return compare
        ? { success: true, user: r[0], msg: '로그인 되었습니다.' }
        : { success: false, user: null, msg: '비밀번호가 일치하지 않습니다.' };
    } else return { success: false, user: null, msg: '아이디가 일치하지 않습니다.' };
  } catch (err) {
    throw new Error(err);
  }
};
const updateLoginIp = async (loginIp, id) => {
  try {
    let now = moment().format('YYYY-MM-DD HH:mm:ss');
    let sql = `
      UPDATE m001_member
      SET last_login_ip='${loginIp}', last_login_date='${now}'
      WHERE member_id='${id}' 
    `;
    await pool.execute(sql);
  } catch (err) {
    throw new Error(err);
  }
};

const findUser = async (midx) => {
  try {
    let sql = `
      SELECT M.*, C.* FROM m001_member AS M
      LEFT JOIN m002_company AS C ON M.cidx = C.cidx
      WHERE M.midx='${midx}'
    `;
    const [rs] = await pool.execute(sql);
    return rs.length === 1 ? { success: true, user: rs[0] } : { success: false, user: null };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { login, findUser, updateLoginIp };
