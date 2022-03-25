const axios = require('axios');
const { pool } = require('../../modules/mysql-md');
const bcrypt = require('bcrypt');

const isIdDuplication = async (id) => {
  try {
    let sql = `
      SELECT member_id FROM m001_member
      WHERE member_id='${id}'
    `;
    const [[rs]] = await pool.execute(sql);
    return rs ? { success: true } : { success: false };
  } catch (err) {
    throw new Error(err);
  }
};

const saveCompanyMember = async (body, cidx) => {
  let { BCRYPT_SALT: salt, BCRYPT_ROUND: round } = process.env;
  let sql = '';
  try {
    let {
      member_id,
      member_pw,
      member_name,
      phone01,
      phone02,
      phone03,
      mobile_company,
      mobile,
      email01,
      email02,
      birthday,
      gender,
      is_foreigner,
      is_certified_mobile,
      is_agree_receive,
    } = body;

    let phone = phone01 + phone02 + phone03;
    let email = email01 + '@' + email02;
    let hashPasswd = await bcrypt.hash(member_pw + salt, Number(round));

    sql = `
      SELECT midx AS lastMidx FROM m001_member
      ORDER BY midx DESC
      LIMIT 1
    `;
    const [[{ lastMidx }]] = await pool.execute(sql);

    sql = `
      INSERT INTO m001_member
      SET cidx=?, member_id=?, member_pw=?, member_name=?, phone=?, mobile_company=?, mobile=?, email=?, birthday=?, gender=?, is_foreigner=?, is_certified_mobile=?, is_agree_receive=?, reg_midx=?, mod_midx=?
    `;
    let values = [
      cidx,
      member_id,
      hashPasswd,
      member_name,
      phone,
      mobile_company,
      mobile,
      email,
      birthday,
      gender,
      0, // is_foreigner,
      0, // is_certified_mobile,
      is_agree_receive,
      lastMidx + 1,
      lastMidx + 1,
    ];
    const data = await pool.execute(sql, values);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { saveCompanyMember, isIdDuplication };
