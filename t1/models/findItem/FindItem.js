const { pool } = require('../../modules/mysql-md');
const moment = require('moment');

const saveFindItem = async (body) => {
  const { midx, item_type, trade_type, company_name, user_name, phone, mobile, title, contents } = body;
  try {
    let sql = `
      INSERT INTO item_find
      SET midx=?, item_type=?, trade_type=?, company_name=?, user_name=?, phone=?, mobile=?, title=?, contents=?, reg_midx=?, mod_midx=?
    `;
    let values = [
      midx,
      item_type,
      trade_type,
      company_name,
      user_name,
      phone,
      mobile,
      title,
      contents,
      midx,
      midx,
    ];
    const [rs] = await pool.execute(sql, values);
    return rs.affectedRows === 1 ? { success: true } : { success: false };
    // return rs;
  } catch (err) {
    throw new Error(err);
  }
};

const findItemLists = async (startIdx, company_name, title, contents) => {
  try {
    sql = `
      SELECT
      item_find.idx, item_find.item_type, item_find.trade_type, item_find.title, item_find.company_name, item_find.reg_date, item_find.hit
      FROM item_find
      WHERE company_name LIKE '%${company_name}%' AND title LIKE '%${title}%' AND contents LIKE '%${contents}%'
      ORDER BY item_find.idx DESC
      LIMIT ${startIdx}, 20
    `;
    const [lists] = await pool.execute(sql);
    lists.forEach((v) => {
      v.reg_date = moment(v.reg_date).format('YYYY-MM-DD');
      v.className = v.trade_type === '월세' ? 'rental' : v.trade_type === '전세' ? 'charter' : 'sale';
    });
    return lists;
  } catch (err) {
    throw new Error(err);
  }
};

const findItemCount = async (company_name, title, contents) => {
  try {
    let sql = `
      SELECT COUNT(idx) AS count FROM item_find WHERE company_name LIKE '%${company_name}%' AND title LIKE '%${title}%' AND contents LIKE '%${contents}%'
    `;
    const [[count]] = await pool.execute(sql);
    return count;
  } catch (err) {
    throw new Error(err);
  }
};

const findItemList = async (idx) => {
  try {
    let sql = ``;
    sql = `
      UPDATE item_find SET hit = hit + 1
      WHERE idx='${idx}'
    `;
    await pool.execute(sql);
    sql = `
      SELECT title, item_type, trade_type, company_name, user_name, phone, mobile, contents, hit, reg_date
      FROM item_find
      WHERE idx='${idx}'
    `;
    const [[rs]] = await pool.execute(sql);
    rs.reg_date = moment(rs.reg_date).format('YYYY-MM-DD');
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { saveFindItem, findItemLists, findItemCount, findItemList };
