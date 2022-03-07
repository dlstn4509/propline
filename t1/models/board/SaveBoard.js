const { pool } = require('../../modules/mysql-md');

const saveBoard = async (body) => {
  try {
    const { title, writer, content, image1, image2, image3, video1 } = body;
    let sql = `
      INSERT INTO board
      SET title=${title}, writer=${writer}, content=${content}
    `;
    const [data] = await pool.execute(sql);
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

const updateBoard = async (body) => {
  try {
    const { title, writer, content, image1, image2, image3, video1, id } = body;
    let sql = `
      UPDATE board
      SET title='${title}', writer='${writer}', content='${content}'
      WHERE board.id=${id}
    `;
    const [data] = await pool.execute(sql);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const updateFile = async (key, val, id) => {
  try {
    let sql = `
      UPDATE boardfile
      SET filename=?, originalname=?, mimetype=?, size=?
      WHERE board_id=? AND fieldname=?
    `;
    let values = [val.filename, val.originalname, val.mimetype, val.size, id, val.fieldname];
    const [data] = await pool.execute(sql, values);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { saveBoard, saveFile, updateBoard, updateFile };
