const { pool } = require('../../modules/mysql-md');

const saveHome = async (
  sido,
  sigungu,
  dong,
  bun,
  ji,
  lat,
  lng,
  item_type,
  trade_type,
  price,
  deposit,
  rent,
  mfee,
  bcode
) => {
  try {
    let sql = '';
    sql = `
    INSERT INTO maps
    SET sido=?, sigungu=?, dong=?, bun=?,
        lat=?, lng=?, item_type=?, trade_type=?, price=?, deposit=?, rent=?, mfee=?, bcode=?
    `;
    let values = [
      sido,
      sigungu,
      dong,
      bun,
      lat,
      lng,
      item_type,
      trade_type,
      price,
      deposit,
      rent,
      mfee,
      bcode,
    ];
    ji ? (sql += `ji=${ji}`) : '';
    const [data] = await pool.execute(sql, values);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const saveFile = async (insertId, key, val) => {
  try {
    let sql = `
    INSERT INTO maps2file
    SET originalname=?, filename=?, mimetype=?, fieldname=?, size=?, maps2_item_no=?
    `;
    let values = [val.originalname, val.filename, val.mimetype, val.fieldname, val.size, insertId];
    const [data] = await pool.execute(sql, values);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { saveHome, saveFile };
