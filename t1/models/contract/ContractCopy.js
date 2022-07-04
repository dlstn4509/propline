const { pool } = require('../../modules/mysql-md');
const moment = require('moment');

const copyContract = async (idx) => {
  try {
    let sql = ``;
    sql = `
      SELECT idx
      FROM contract
      ORDER BY idx DESC
      LIMIT 1
    `;
    let [[{ idx: LastIdx }]] = await pool.execute(sql);

    sql = `
      INSERT INTO contract
      SELECT
      ${LastIdx + 1},
      sido,
      sigungu,
      eupmyeondong,
      bungi,
      detail_address,
      land_purpose,
      land_area,
      building_structure,
      building_use,
      building_area,
      lease_part,
      lease_area,
      trade_type,
      contract_start_date,
      contract_finish_date,
      earnest,
      balance,
      balance_date,
      commission_rate,
      special_contract,
      contract_date,
      grantor_address,
      grantor_identity_no_type,
      grantor_identity_no,
      grantor_phone,
      grantor_name,
      grantor_proxy_type,
      grantor_proxy_name,
      grantee_address,
      grantee_identity_no_type,
      grantee_identity_no,
      grantee_phone,
      grantee_name,
      grantee_proxy_type,
      grantee_proxy_name,
      agent1_office_name,
      agent1_office_ceo_name,
      agent1_office_address,
      agent1_office_registration_no,
      agent1_office_phone,
      agent2_office_name,
      agent2_office_ceo_name,
      agent2_office_address,
      agent2_office_registration_no,
      agent2_office_phone,
      selling_amount,
      loan_amount,
      loan_promise,
      security,
      interim1_amount,
      interim1_date,
      interim2_amount,
      interim2_date,
      monthly_rent,
      monthly_rent_payment_type,
      monthly_rent_payment_day,
      maintenance_fee,
      public_charges_fee,
      cleaning_fee,
      discount_monthly_rent,
      index_of_power,
      index_of_gas,
      index_of_water,
      item_transfer_range,
      sign_jumin,
      sign_name,
      agent_one_chk,
      ${moment().format('YYYYMMDDHHmmss')},
      reg_midx,
      ${moment().format('YYYYMMDDHHmmss')},
      mod_midx
      FROM contract
      WHERE idx=${idx}
    `;
    const [rs] = await pool.execute(sql);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { copyContract };
