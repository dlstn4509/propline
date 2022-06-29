const { pool } = require('../../modules/mysql-md');
const moment = require('moment');

const UpdateLease = async (body) => {
  try {
    const {
      idx,
      mod_midx,
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
      security,
      earnest,
      interim1_amount,
      interim1_date_year,
      interim1_date_month,
      interim1_date_day,
      balance,
      balance_date_year,
      balance_date_month,
      balance_date_day,
      contract_start_date_year,
      contract_start_date_month,
      contract_start_date_day,
      contract_finish_date_year,
      contract_finish_date_month,
      contract_finish_date_day,
      commission_rate,
      special_contract,
      contract_date_year,
      contract_date_month,
      contract_date_day,
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
      agent1_office_address,
      agent1_office_name,
      agent1_office_phone,
      agent1_office_registration_no,
      agent1_office_ceo_name,
      agent2_office_address,
      agent2_office_name,
      agent2_office_phone,
      agent2_office_registration_no,
      agent2_office_ceo_name,
      agent_one_chk,
    } = body;

    let interim1_date = interim1_date_year + interim1_date_month + interim1_date_day;
    let balance_date = balance_date_year + balance_date_month + balance_date_day;
    let contract_start_date = contract_start_date_year + contract_start_date_month + contract_start_date_day;
    let contract_finish_date =
      contract_finish_date_year + contract_finish_date_month + contract_finish_date_day;
    let contract_date = contract_date_year + contract_date_month + contract_date_day;

    let sql = `
      UPDATE contract SET
      mod_midx=?,
      sido=?,
      sigungu=?,
      eupmyeondong=?,
      bungi=?,
      detail_address=?,
      land_purpose=?,
      land_area=?,
      building_structure=?,
      building_use=?,
      building_area=?,
      lease_part=?,
      security=?,
      earnest=?,
      interim1_amount=?,
      interim1_date=?,
      balance=?,
      balance_date=?,
      contract_start_date=?,
      contract_finish_date=?,
      commission_rate=?,
      special_contract=?,
      contract_date=?,
      grantor_address=?,
      grantor_identity_no_type=?,
      grantor_identity_no=?,
      grantor_phone=?,
      grantor_name=?,
      grantor_proxy_type=?,
      grantor_proxy_name=?,
      grantee_address=?,
      grantee_identity_no_type=?,
      grantee_identity_no=?,
      grantee_phone=?,
      grantee_name=?,
      grantee_proxy_type=?,
      grantee_proxy_name=?,
      agent1_office_address=?,
      agent1_office_name=?,
      agent1_office_phone=?,
      agent1_office_registration_no=?,
      agent1_office_ceo_name=?,
      agent2_office_address=?,
      agent2_office_name=?,
      agent2_office_phone=?,
      agent2_office_registration_no=?,
      agent2_office_ceo_name=?,
      agent_one_chk=?,
      mod_date=?
      WHERE idx=${idx}
    `;

    let values = [
      mod_midx,
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
      security.split(',').join(''),
      earnest.split(',').join(''),
      interim1_amount.split(',').join(''),
      interim1_date,
      balance.split(',').join(''),
      balance_date,
      contract_start_date,
      contract_finish_date,
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
      agent1_office_address,
      agent1_office_name,
      agent1_office_phone,
      agent1_office_registration_no,
      agent1_office_ceo_name,
      agent2_office_address,
      agent2_office_name,
      agent2_office_phone,
      agent2_office_registration_no,
      agent2_office_ceo_name,
      agent_one_chk,
      moment().format('YYYY-MM-DD'),
    ];
    const [rs] = await pool.execute(sql, values);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { UpdateLease };
