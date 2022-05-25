const { pool } = require('../../modules/mysql-md');
const moment = require('moment');

const mainNoticeLists = async () => {
  try {
    let sql = `
      SELECT idx, title, mod_date
      FROM notice
      ORDER BY mod_date DESC
      LIMIT 0, 5
    `;
    const [lists] = await pool.execute(sql);
    for (let v of lists) {
      v.isNew = moment().subtract(3, 'days').format('YYYY-MM-DD') <= moment(v.mod_date).format('YYYY-MM-DD');
    }
    return lists;
  } catch (err) {
    throw new Error(err);
  }
};

const ss = async () => {
  try {
    let arr = [];
    for (let i = 0; i < arr.length; i++) {
      let sql = `
      INSERT INTO c002_legal_dong_code SET
      idx='${arr[i][0]}', legal_dong_code='${arr[i][1]}', sido='${arr[i][2]}', sigungu='${arr[i][3]}', legal_dong='${arr[i][4]}', eupmyeondong='${arr[i][5]}', ri='${arr[i][6]}', latitude='${arr[i][7]}', longitude='${arr[i][8]}', blockcode_list='${arr[i][9]}'
    `;
      await pool.execute(sql);
    }
    return 'success';
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

module.exports = { mainNoticeLists, ss };
