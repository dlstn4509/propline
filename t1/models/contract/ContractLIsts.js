const { pool } = require('../../modules/mysql-md');
const moment = require('moment');

const findContractLists = async (type) => {
  try {
    let sql = `
    SELECT
    idx, sido, sigungu, eupmyeondong, bungi, detail_address, grantor_name, grantee_name, contract_date, mod_date
    FROM contract
    WHERE trade_type=${type} ORDER BY idx DESC
  `;
    let [lists] = await pool.execute(sql);
    lists.forEach((v) => {
      v.contract_date = moment(v.contract_date).format('YYYY-MM-DD');
      v.mod_date = moment(v.mod_date).format('YYYY-MM-DD');
    });
    return lists;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { findContractLists };
