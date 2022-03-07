const { pool } = require('../../modules/mysql-md');

const viewBoard = async (id) => {
  try {
    let data = [];
    let sql = `
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
    let files = views.map((v) => {
      return {
        board_id: v.BF_id,
        filename: makeFileName(v.filename, v.mimetype),
        mimetype: v.mimetype,
        fieldname: v.fieldname,
        originalname: v.originalname,
      };
    });
    data = {
      view: {
        id: views[0].id,
        title: views[0].title,
        writer: views[0].writer,
        content: views[0].content,
        createdAt: views[0].createdAt,
      },
      files,
    };
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { viewBoard };
