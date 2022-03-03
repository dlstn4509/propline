const { pool } = require('../../modules/mysql-md');

const saveBoard = async (body) => {
  try {
    const { title, writer, content, image1, image2, image3, video1 } = body;
    let sql = `
      INSERT INTO board
      SET title=?, writer=?, content=?
    `;
    let values = [title, writer, content];
    const [data] = await pool.execute(sql, values);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const saveFile = async (insertId, key, val) => {
  try {
    let sql = `
      INSERT INTO boardfile
      SET filename=?, originalname=?, mimetype=?, fieldname=?, size=?, board_id=?
    `;
    let values = [val.filename, val.originalname, val.mimetype, val.fieldname, val.size, insertId];
    const [data] = await pool.execute(sql, values);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { saveBoard, saveFile };
