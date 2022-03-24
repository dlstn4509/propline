const axios = require('axios');
const { pool } = require('../../modules/mysql-md');

const saveCompany = async (body, fileObj) => {
  let sql = '';
  let {
    company_name,
    company_alias,
    president,
    company_no01,
    company_no02,
    company_no03,
    business_kind,
    business_item,
    registration_no,
    zonecode,
    road_name,
    detail_address,
    latitude,
    longitude,
    legal_dong_code,
    sido,
    sigungu,
    eupmyeondong,
    ri,
    is_mountain,
    land_no_m,
    land_no_s,
    building_no_m,
    building_no_s,
    building_name,
    companyPhone01,
    companyPhone02,
    companyPhone03,
    fax01,
    fax02,
    fax03,
  } = body;
  try {
    let company_no = company_no01 + '-' + company_no02 + '-' + company_no03;
    let companyPhone = companyPhone01 + '-' + companyPhone02 + '-' + companyPhone03;
    let fax = fax01 + fax02 + fax03;

    sql = `
      SELECT cidx AS lastCidx FROM m002_company
      ORDER BY cidx DESC
      LIMIT 1
    `;
    const [[{ lastCidx }]] = await pool.execute(sql);
    sql = `
      INSERT INTO m002_company
      SET company_name=?, company_alias=?, company_no=?, business_kind=?,
      business_item=?, president=?, latitude=?, longitude=?, legal_dong_code=?,
      zonecode=?, sido=?, sigungu=?, eupmyeondong=?, ri=?, is_mountain=?,
      land_no_m=?, land_no_s=?, road_name=?, building_no_m=?, building_no_s=?,
      building_name=?,  detail_address=?,  phone=?,  fax=?,  registration_no=?,
      company_no_file=?, registration_no_file=?, reg_midx=?, mod_midx=?
    `;
    let values = [
      company_name,
      company_alias,
      company_no,
      business_kind,
      business_item,
      president,
      latitude,
      longitude,
      legal_dong_code,
      zonecode,
      sido,
      sigungu,
      eupmyeondong,
      ri,
      is_mountain,
      land_no_m,
      land_no_s,
      road_name,
      building_no_m,
      building_no_s,
      building_name,
      detail_address,
      companyPhone,
      fax,
      registration_no,
      fileObj.company_no_file,
      fileObj.registration_no_file,
      lastCidx + 1,
      lastCidx + 1,
    ];
    const data = await pool.execute(sql, values);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { saveCompany };
