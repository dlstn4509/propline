const { pool } = require('../../modules/mysql-md');

const saveFindItem = async (body) => {
  const { midx, item_type, trade_type, company_type, user_name, phone, mobile, title, contents } = body;
  try {
    let sql = `
      INSERT INTO item_find
      SET midx=?, item_type=?, trade_type=?, company_type=?, user_name=?, phone=?, mobile=?, title=?, contents=?, reg_midx=?, mod_midx=?
    `;
    let values = [
      1011,
      item_type,
      trade_type,
      company_type,
      user_name,
      phone,
      mobile,
      title,
      contents,
      1011,
      1011,
    ];
    const [rs] = await pool.execute(sql, values);
    return rs.affectedRows === 1 ? { success: true } : { success: false };
    // return rs;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { saveFindItem };
