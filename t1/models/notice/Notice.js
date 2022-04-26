const { pool } = require('../../modules/mysql-md');
const moment = require('moment');

const saveNotice = async (body, files) => {
  const {
    title,
    title_font_weight,
    title_font_color,
    is_top_rank,
    auth_view,
    contents,
    contents1,
    contents2,
    contents3,
    contents4,
    contents5,
    reg_midx,
    mod_midx,
  } = body;
  let photo1 = '';
  let photo2 = '';
  let photo3 = '';
  let photo4 = '';
  let photo5 = '';
  let attached_file1 = '';
  let attached_file1_oriname = '';
  let attached_file2 = '';
  let attached_file2_oriname = '';
  try {
    for (let [key, [val]] of Object.entries(files)) {
      switch (key) {
        case 'photo1':
          photo1 = val.filename;
          break;
        case 'photo2':
          photo2 = val.filename;
          break;
        case 'photo3':
          photo3 = val.filename;
          break;
        case 'photo4':
          photo4 = val.filename;
          break;
        case 'photo5':
          photo5 = val.filename;
          break;
        case 'attached_file1':
          attached_file1 = val.filename;
          attached_file1_oriname = val.originalname;
          break;
        case 'attached_file2':
          attached_file2 = val.filename;
          attached_file2_oriname = val.originalname;
          break;
      }
    }
    let sql = `
      INSERT INTO notice SET
      title=?, title_font_weight=?, title_font_color=?, is_top_rank=?, auth_view=?, contents=?, contents1=?, contents2=?, contents3=?, contents4=?, contents5=?, reg_midx=?, mod_midx=?, attached_file1=?, attached_file2=?, photo1=?, photo2=?, photo3=?, photo4=?, photo5=?, attached_file1_oriname=?, attached_file2_oriname=?
    `;
    let values = [
      title,
      title_font_weight,
      title_font_color,
      Number(is_top_rank),
      Number(auth_view),
      contents,
      contents1,
      contents2,
      contents3,
      contents4,
      contents5,
      reg_midx,
      mod_midx,
      attached_file1,
      attached_file2,
      photo1,
      photo2,
      photo3,
      photo4,
      photo5,
      attached_file1_oriname,
      attached_file2_oriname,
    ];
    const [rs] = await pool.execute(sql, values);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

const findLists = async (startIdx) => {
  try {
    let sql = `
      SELECT idx, is_top_rank, title, title_font_color, title_font_weight, reg_date, hit
      FROM notice
      WHERE record_status = 2
      ORDER BY FIELD(is_top_rank, 0, 1) DESC, idx DESC
      LIMIT ${startIdx}, 20
    `;
    const [lists] = await pool.execute(sql);
    for (let v of lists) {
      v.reg_date = moment(v.reg_date).format('YYYY-MM-DD');
    }
    return lists;
  } catch (err) {
    throw new Error(err);
  }
};

const listsCount = async () => {
  try {
    let sql = `
      SELECT COUNT(idx) AS count
      FROM notice
      WHERE record_status='2'
    `;
    const [[{ count }]] = await pool.execute(sql);
    return count;
  } catch (err) {
    throw new Error(err);
  }
};

const findList = async (idx) => {
  try {
    let sql = '';
    sql = `
      UPDATE notice SET hit = hit + 1
      WHERE idx=${idx}
    `;
    await pool.execute(sql);
    sql = `
      SELECT N.idx, N.title, N.contents, N.photo1, N.contents1, N.photo2, N.contents2, N.photo3, N.contents3, N.photo4, N.contents4, N.photo5,
      N.contents5, N.attached_file1, N.attached_file2, N.hit, N.mod_date,
      N.attached_file1_oriname, N.attached_file2_oriname,
      C.company_name
      FROM notice AS N
      LEFT JOIN m002_company AS C ON N.mod_midx = C.cidx
      WHERE idx='${idx}'
    `;
    const [[list]] = await pool.execute(sql);
    list.photo1FilePath = list.photo1 ? list.photo1.split('_')[0] + '/' + list.photo1 : '';
    list.photo2FilePath = list.photo2 ? list.photo2.split('_')[0] + '/' + list.photo2 : '';
    list.photo3FilePath = list.photo3 ? list.photo3.split('_')[0] + '/' + list.photo3 : '';
    list.photo4FilePath = list.photo4 ? list.photo4.split('_')[0] + '/' + list.photo4 : '';
    list.photo5FilePath = list.photo5 ? list.photo5.split('_')[0] + '/' + list.photo5 : '';
    list.file1FilePath = list.attached_file1
      ? list.attached_file1.split('_')[0] + '/' + list.attached_file1
      : '';
    list.file2FilePath = list.attached_file2
      ? list.attached_file2.split('_')[0] + '/' + list.attached_file2
      : '';
    list.mod_date = moment(list.mod_date).format('YYYY-MM-DD HH:mm:ss');
    return list;
  } catch (err) {
    throw new Error(err);
  }
};

const findFile = async (idx, col) => {
  try {
    let sql = ` SELECT ${col}, ${col + '_oriname'} FROM notice WHERE idx = ${idx} `;
    const [[file]] = await pool.execute(sql);
    return file;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteList = async (idx) => {
  try {
    let sql = `
      UPDATE notice SET record_status = 9
      WHERE idx='${idx}'
    `;
    const [rs] = await pool.execute(sql);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { saveNotice, findLists, listsCount, findList, findFile, deleteList };

// https://t1.propline.co.kr/api/notice/download?idx=160&col=attached_file1
