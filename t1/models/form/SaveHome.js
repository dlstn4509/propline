const { pool } = require('../../modules/mysql-md');

const saveHome = async (
  sido,
  sigungu,
  dong,
  lat,
  lng,
  item_type,
  trade_type,
  price,
  deposit,
  rent,
  mfee
) => {
  try {
    let sql = '';
    sql = `
    INSERT INTO maps2
    SET sido=?, sigungu=?, dong=?, lat=?, lng=?, item_type=?, trade_type=?, price=?, deposit=?, rent=?, mfee=?
    `;
    let values = [sido, sigungu, dong, lat, lng, item_type, trade_type, price, deposit, rent, mfee];
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
    SET originalname=?, filename=?, mimetype=?, fieldname=?, size=?, maps2_id=?
    `;
    let values = [val.originalname, key, val.mimetype, val.fieldname, val.size, insertId];
    const [data] = await pool.execute(sql, values);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { saveHome, saveFile };
