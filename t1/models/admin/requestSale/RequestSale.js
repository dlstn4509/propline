const { pool } = require('../../../modules/mysql-md');
const moment = require('moment');

const findLists = async (startIdx, listCnt) => {
  try {
    let sql = ``;
    sql = `
      SELECT * FROM item_ad_request WHERE request_kind='1' ORDER BY idx DESC
      LIMIT ${startIdx}, ${listCnt};
    `;
    const [lists] = await pool.execute(sql);
    lists.forEach((v) => {
      v.reg_date = moment(v.reg_date).format('YYYY-MM-DD');
      v.mod_date = moment(v.mod_date).format('YYYY-MM-DD');
      v.phone =
        v.user_phone.substring(0, 3) +
        '-' +
        v.user_phone.substring(3, 7) +
        '-' +
        v.user_phone.substring(7, 11);
      switch (v.record_state) {
        case 0:
          return (v.record_state = '대기');
        case 1:
          return (v.record_state = '완료');
        case 2:
          return (v.record_state = '완료-결번');
        case 3:
          return (v.record_state = '완료-부재중');
        case 4:
          return (v.record_state = '완료-통화거부');
        case 5:
          return (v.record_state = '완료-신규(공실)');
        case 6:
          return (v.record_state = '완료-기존매물');
        default:
          return '대기';
      }
    });
    return lists;
  } catch (err) {
    throw new Error(err);
  }
};

const findListsCount = async () => {
  try {
    let sql = `
      SELECT COUNT(idx) AS count FROM item_ad_request WHERE request_kind='1'
    `;
    const [[count]] = await pool.execute(sql);
    return count;
  } catch (err) {
    throw new Error(err);
  }
};

const findList = async (idx) => {
  try {
    let sql = `
      SELECT I.*, M.member_name FROM item_ad_request I
      LEFT JOIN m001_member M ON I.mod_midx = M.midx
      WHERE I.idx='${idx}'
    `;
    const [[list]] = await pool.execute(sql);
    list.reg_date = moment(list.reg_date).format('YYYY-MM-DD HH:mm:ss');
    list.mod_date = moment(list.mod_date).format('YYYY-MM-DD HH:mm:ss');
    list.commission = list.commission.split('^').join(' ');
    list.is_want_naverad = list.is_want_naverad === 1 ? '동의' : '미동의';
    list.phone =
      list.user_phone.substring(0, 3) +
      '-' +
      list.user_phone.substring(3, 7) +
      '-' +
      list.user_phone.substring(7, 11);
    return list;
  } catch (err) {
    throw new Error(err);
  }
};

const updateList = async (body) => {
  const { idx, midx, record_type, record_state, admin_memo } = body;
  try {
    let sql = `
      UPDATE item_ad_request SET record_state=?, admin_memo=?, mod_date=?, mod_midx=?
      WHERE idx=?
    `;
    newRecord_state = record_type === 'ready' ? 0 : record_state;
    let values = [newRecord_state, admin_memo, moment().format('YYYY-MM-DD HH:mm:ss'), midx, idx];
    const [rs] = await pool.execute(sql, values);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { findLists, findListsCount, findList, updateList };
