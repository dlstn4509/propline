const { pool } = require('../../modules/mysql-md');

const saveComment = async (body) => {
  try {
    const { content, writer, id } = body;
    let sql = `
      INSERT INTO boardcomment
      SET content=?, writer=?, seq='1', board_id=?
    `;
    let values = [content, writer, id];
    const [rs] = await pool.execute(sql, values);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteComment = async (id, depth, seq) => {
  try {
    let sql = `
      UPDATE boardcomment SET status = '0'
      WHERE id='${id}' AND depth='${depth}' AND seq='${seq}'
    `;
    const rs = await pool.execute(sql);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

const saveReComment = async (content, writer, id, board_id) => {
  try {
    let sql = `
        INSERT INTO boardcomment
        SET content=?, writer=?, parent=?, depth=?, board_id=?
      `;
    const values = [content, writer, id, 2, board_id];
    const [rs] = await pool.execute(sql, values);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

const updateReComment = async (body) => {
  try {
    const { content, writer, id } = body;
    let sql = `
      UPDATE boardcomment
      SET content=?, writer=?
      WHERE id='${id}'
    `;
    const [rs] = await pool.execute(sql, [content, writer]);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

const likeComment = async (id, heartColor) => {
  try {
    let sql = `
      UPDATE boardcomment
      SET likecounter = likecounter + ?
      WHERE id='${id}'
    `;
    const values = [heartColor === 'black' ? +1 : -1];
    const [rs] = await pool.execute(sql, values);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { saveComment, deleteComment, saveReComment, updateReComment, likeComment };
