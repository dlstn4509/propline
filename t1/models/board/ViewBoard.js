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
      ORDER BY  IF(ISNULL(parent), id, parent), createdAt, depth
    `;
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

module.exports = { viewBoard };
