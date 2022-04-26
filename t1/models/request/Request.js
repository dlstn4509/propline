const { pool } = require('../../modules/mysql-md');
const moment = require('moment');

const findLists = async (startIdx, isRequest, item_kind, searchTxt) => {
  try {
    let sql = '';
    sql = `
      SELECT I.*, COUNT(L.iar_idx) AS readingCompanyCount
      FROM item_ad_request AS I
      LEFT JOIN item_ad_request_log AS L ON I.idx = L.iar_idx
      WHERE I.request_kind='2'
      AND I.item_kind LIKE '${item_kind}%'
      AND I.memo LIKE '%${searchTxt}%'
    `;
    if (isRequest === 'true') {
      sql += ` AND I.reg_date BETWEEN DATE_ADD (NOW(), INTERVAL -30 DAY) AND NOW() `;
    }
    sql += `
      GROUP BY I.idx
      ORDER BY I.idx DESC
      LIMIT ${startIdx}, 20
    `;
    const [lists] = await pool.execute(sql);
    lists.forEach((v) => {
      v.requestLimitDate = moment(v.reg_date).format('YYYY-MM-DD') >= moment().subtract(1, 'month').format();
      v.isNew = moment(v.reg_date).format('YYYY-MM-DD') >= moment().subtract(3, 'day').format();
      switch (v.call_time) {
        case '1':
          v.call_time = '상관없음';
          return v.call_time;
        case '2':
          v.call_time = '오전(9시~12시)';
          return v.call_time;
        case '3':
          v.call_time = '오후(12시~7시)';
          return v.call_time;
        default:
          v.call_time = v.call_time.split('^')[1];
          return v.call_time;
      }
    });
    return lists;
  } catch (err) {
    throw new Error(err);
  }
};

const listsCount = async (isRequest, item_kind, searchTxt) => {
  try {
    let sql = `
      SELECT COUNT(idx) AS count
      FROM item_ad_request
      WHERE request_kind='2'
      AND item_kind LIKE '${item_kind}%'
      AND memo LIKE '%${searchTxt}%'
    `;
    if (isRequest === 'true') {
      sql += ` AND reg_date BETWEEN DATE_ADD (NOW(), INTERVAL -30 DAY) AND NOW() `;
    }
    const [[{ count }]] = await pool.execute(sql);
    return count;
  } catch (err) {
    throw new Error(err);
  }
};

const findList = async (idx) => {
  try {
    let sql = `
      SELECT * FROM item_ad_request
      WHERE idx='${idx}'
    `;
    const [list] = await pool.execute(sql);
    list.forEach((v) => {
      v.requestLimitDate = moment(v.reg_date).format('YYYY-MM-DD') >= moment().subtract(1, 'month').format();
      v.reg_date = moment(v.reg_date).format('YYYY-MM-DD HH:mm:ss');
      switch (v.call_time) {
        case '1':
          v.call_time = '상관없음';
          return v.call_time;
        case '2':
          v.call_time = '오전(9시~12시)';
          return v.call_time;
        case '3':
          v.call_time = '오후(12시~7시)';
          return v.call_time;
        default:
          v.call_time = v.call_time.split('^')[1];
          return v.call_time;
      }
    });
    return list;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteList = async (idx) => {
  try {
    let sql = `
      DELETE FROM item_ad_request WHERE idx='${idx}'
    `;
    const [rs] = await pool.execute(sql);
    return rs.affectedRows === 1 ? { success: true } : { success: false };
  } catch (err) {
    throw new Error(err);
  }
};

const checkPhoneNum = async (idx, midx, cidx) => {
  try {
    let sql = `
      SELECT user_phone FROM item_ad_request WHERE idx='${idx}'
    `;
    const [[{ user_phone }]] = await pool.execute(sql);
    if (user_phone) {
      sql = `
        INSERT INTO item_ad_request_log SET
        iar_idx='${idx}', cidx='${cidx}', midx='${midx}'
      `;
      const [rs] = await pool.execute(sql);
      return rs.affectedRows === 1 ? user_phone : next(err);
    }
  } catch (err) {
    throw new Error(err);
  }
};

const isLog = async (iar_idx, cidx) => {
  try {
    let sql = `
      SELECT COUNT(idx) AS count FROM item_ad_request_log
      WHERE iar_idx='${iar_idx}' AND cidx='${cidx}'
    `;
    const [[{ count }]] = await pool.execute(sql);
    if (count === 1) {
      sql = `
        SELECT user_phone FROM item_ad_request
        WHERE idx='${iar_idx}'
      `;
      const [[{ user_phone }]] = await pool.execute(sql);
      return user_phone;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error(err);
  }
};

const readingCompany = async (iar_idx) => {
  try {
    let readingCompanyArr = [];
    let sql = `
      SELECT cidx, reg_date FROM item_ad_request_log
      WHERE iar_idx='${iar_idx}'
    `;
    const [cidx] = await pool.execute(sql);
    for (let i = 0; i < cidx.length; i++) {
      sql = `
      SELECT company_name FROM m002_company
      WHERE cidx='${cidx[i].cidx}'
      `;
      const [[rs]] = await pool.execute(sql);
      readingCompanyArr.push({
        company_name: rs.company_name,
        reg_date: moment(cidx[i].reg_date).format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    return readingCompanyArr;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { findLists, listsCount, findList, deleteList, checkPhoneNum, isLog, readingCompany };
