const { pool } = require('../../../modules/mysql-md');
const bcrypt = require('bcrypt');

const adminSignUp = async (body) => {
  let { BCRYPT_SALT: salt, BCRYPT_ROUND: round } = process.env;
  const {
    member_id,
    member_pw,
    member_pw02,
    member_name,
    phone01,
    phone02,
    phone03,
    mobile01,
    mobile02,
    mobile03,
    email01,
    email02,
  } = body;
  try {
    let sql = ``;
    sql = `
      SELECT midx FROM m001_member
      ORDER BY midx DESC
      LIMIT 1`;
    const [[{ midx }]] = await pool.execute(sql);
    sql = `
      INSERT INTO m001_member SET
      cidx=1000, member_id=?, member_pw=?, member_name=?, phone=?, mobile=?, email=?, reg_midx=?, mod_midx=?
    `;

    let phone = phone01 + phone02 + phone03;
    let mobile = mobile01 + mobile02 + mobile03;
    let email = email01 + '@' + email02;
    let hashPasswd = await bcrypt.hash(member_pw + salt, Number(round));

    let values = [member_id, hashPasswd, member_name, phone, mobile, email, midx + 1, midx + 1];
    const [rs] = await pool.execute(sql, values);
    return rs.affectedRows === 1 ? { success: true } : { success: false };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { adminSignUp };
