const { pool } = require('../../modules/mysql-md');

const requestSale = async (body) => {
  const {
    request_kind, //a
    item_kind, //a
    sido, //a
    sigungu, //a
    eupmyeondong, //a
    memo, //a
    user_name, //a
    midx, //a
    /* request_kind = 1 */
    commissionType,
    commission,
    land_no_m,
    land_no_s,
    is_mountain,
    detail_address,
    user_kind,
    user_phone01,
    user_phone02,
    user_phone03,
    is_want_naverad,
    ri,
    /* request_kind = 1 */
    /* request_kind = 2 */
    user_phone,
    call_time,
    otherVal,
    /* request_kind = 2 */
  } = body;
  try {
    let phone = user_phone ? user_phone : user_phone01 + user_phone02 + user_phone03;
    let sql = ``;
    sql = `
      INSERT INTO item_ad_request SET
      request_kind=?, item_kind=?, sido=?, sigungu=?, eupmyeondong=?, memo=?, user_name=?, user_phone=?, reg_midx=?, mod_midx=?
    `;
    let values = [request_kind, item_kind, sido, sigungu, eupmyeondong, memo, user_name, phone, midx, midx];
    if (request_kind === '1') {
      let newCommission = '';
      if (commissionType === '법정수수료') {
        newCommission = commissionType;
      } else if (commissionType === 'input') {
        newCommission = '금액^' + commission;
      } else {
        // commissionType === 'other'
        newCommission = '기타^' + commission;
      }
      sql += `
        , commission=?, land_no_m=?, land_no_s=?, is_mountain=?, detail_address=?, user_kind=?, is_want_naverad=?, ri=?
      `;
      values.push(
        newCommission,
        land_no_m,
        land_no_s,
        is_mountain,
        detail_address,
        user_kind,
        is_want_naverad,
        ri
      );
    } else {
      sql += `, call_time=?`;
      values.push(call_time === 'other' ? '4^' + otherVal : call_time);
    }
    const rs = await pool.execute(sql, values);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { requestSale };
