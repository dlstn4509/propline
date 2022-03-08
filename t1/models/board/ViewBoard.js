const { pool } = require('../../modules/mysql-md');
const moment = require('moment');

const viewBoard = async (id) => {
  try {
    let sql = '';
    let data = [];
    sql = `
      UPDATE board SET readCounter = readCounter + 1 WHERE id=${id}
    `;
    await pool.execute(sql);

    sql = `
      SELECT B.*, BF.id AS BF_id, BF.filename, BF.mimetype, BF.fieldname, BF.originalname FROM board AS B
      LEFT JOIN boardfile AS BF ON b.id = BF.board_id
      WHERE B.id=${id}
    `;
    const [views] = await pool.execute(sql);
    const makeFileName = (fileName, _mimetype) => {
      let date = fileName.split('_')[0];
      let mimetype = _mimetype.split('/')[0];
      return `uploads/${mimetype}/${date}/thumb/${fileName}`;
    };
    let files;
    if (views[0].filename) {
      files = views.map((v) => {
        return {
          board_id: v.BF_id,
          filename: makeFileName(v.filename, v.mimetype),
          mimetype: v.mimetype,
          fieldname: v.fieldname,
          originalname: v.originalname,
        };
      });
    }

    sql = `
      SELECT * FROM boardcomment
      WHERE board_id='${id}' AND status= '1'
      ORDER BY  IF(ISNULL(parent), id, parent), seq , depth
    `;
    // sql = `
    //   SELECT * FROM boardcomment
    //   WHERE board_id='${id}' AND status= '1'
    // `;
    const [comment] = await pool.execute(sql);
    for (let v of comment) {
      v.createdAt = moment(v.createdAt).format('YYYY-MM-DD HH:mm:ss');
    }
    data = {
      view: {
        id: views[0].id,
        title: views[0].title,
        writer: views[0].writer,
        content: views[0].content,
        createdAt: views[0].createdAt,
      },
      files,
      comment,
    };
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const saveComment = async (body) => {
  try {
    const { content, writer, id } = body;
    let sql = '';
    sql = `
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

const saveReComment = async (content, writer, id, board_id, depth, parent) => {
  try {
    let rs = '';
    let sql = '';
    if (depth === '1') {
      sql = `
        SELECT seq FROM boardcomment
        WHERE parent='${id}'
        ORDER BY seq DESC
        LIMIT 1
      `;
      const [[{ seq }]] = await pool.execute(sql);
      console.log(seq);
      console.log(typeof seq);

      sql = `
        INSERT INTO boardcomment
        SET content=?, writer=?, parent=?, depth=?, seq=?, board_id=?
      `;
      const values = [content, writer, id, 2, seq ? seq + 1 : 2, board_id];
      console.log(values);
      [rs] = await pool.execute(sql, values);
    } else {
      sql = `
        INSERT INTO boardcomment
        SET content=?, writer=?, parent=?, depth=?, board_id=?
      `;
      const values = [content, writer, parent, Number(depth) + 1, board_id];
      [rs] = await pool.execute(sql, values);
    }
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { viewBoard, saveComment, deleteComment, saveReComment };
