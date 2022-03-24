const axios = require('axios');
const { pool } = require('../../modules/mysql-md');

const saveCompanyMember = async (body, cidx) => {
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
      member_pw,
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
    console.log(err);
    throw new Error(err);
  }
};

module.exports = { saveCompanyMember };
