const { pool } = require('../../modules/mysql-md');
const moment = require('moment');

const saveFreeBoard = async (body, files) => {
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
    ip,
    record_pw,
    loginUser_midx,
    parent_idx,
    record_hdepth,
    record_vorder,
    member_id,
    company_name,
    user_name,
    phone,
    mobile,
    email,
    record_group,
    idx,
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
    let sql = ``;
    sql = `
      SELECT idx FROM freeboard
      ORDER BY idx DESC
      LIMIT 0, 1
    `;
    const [[lastIdx]] = await pool.execute(sql);
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
      ip,
      record_pw ? record_pw : '',
      parent_idx ? record_group : lastIdx.idx + 1,
    ];
    if (loginUser_midx) {
      sql = `
        SELECT M.member_id, M.member_name, M.phone, M.mobile, M.email, C.company_name
        FROM m001_member AS M
        LEFT JOIN m002_company AS C ON M.cidx=C.cidx
        WHERE M.midx='${loginUser_midx}'
      `;
      const [[loginUser]] = await pool.execute(sql);
      values.push(
        loginUser.member_id,
        loginUser.company_name,
        loginUser.member_name,
        loginUser.phone,
        loginUser.mobile,
        loginUser.email
      );
      //  member_id=?, company_name=?, user_name=?, phone=?, mobile=?, email=?,
    } else {
      values.push(member_id, company_name, user_name, phone, mobile, email);
    }

    if (!parent_idx) {
      values.push('1', 0, '1');
    } else {
      sql = `
        SELECT record_vorder FROM freeboard
        WHERE idx='${idx}'
      `;
      const [[rs]] = await pool.execute(sql);
      values.push(Number(record_hdepth) + 1, idx, Number(rs.record_vorder) + 1);
      sql = `
        UPDATE freeboard
        SET record_vorder = record_vorder + 1
        WHERE record_vorder > '${record_vorder}' AND record_group='${record_group}'
      `;
      await pool.execute(sql);
    }

    sql = `
      INSERT INTO freeboard SET
      title=?, title_font_weight=?, title_font_color=?, is_top_rank=?, auth_view=?, contents=?, contents1=?, contents2=?, contents3=?, contents4=?, contents5=?, reg_midx=?, mod_midx=?, attached_file1=?, attached_file2=?, photo1=?, photo2=?, photo3=?, photo4=?, photo5=?, attached_file1_oriname=?, attached_file2_oriname=?, ip=?,
      record_pw=?, record_group=?, member_id=?, company_name=?, user_name=?, phone=?, mobile=?, email=?,
      record_hdepth=?, parent_idx=?, record_vorder=?
    `;
    const [rs] = await pool.execute(sql, values);
    return rs;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const findLists = async (startIdx, member_id, title, contents) => {
  try {
    let sql = `
      SELECT idx, title, title_font_color, title_font_weight, is_secret,
      is_top_rank, record_pw, parent_idx, record_group, record_vorder,
      record_hdepth, auth_view, hit, recommend, member_id, reg_date
      FROM freeboard
      WHERE record_status=2 AND member_id LIKE '%${member_id}%' AND title LIKE '%${title}%' AND contents LIKE '%${contents}%'
      ORDER BY FIELD(is_top_rank, 0, 1) DESC, record_group DESC, record_vorder ASC
      LIMIT ${startIdx}, 20
    `;
    const [lists] = await pool.execute(sql);
    lists.forEach((v) => {
      v.reg_date = moment(v.reg_date).format('YYYY-MM-DD');
      v.isNew = moment(v.reg_date).format('YYYY-MM-DD') >= moment().subtract(3, 'day').format();
    });
    return lists;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const findList = async (idx) => {
  try {
    let sql = '';
    sql = `
      UPDATE freeboard SET hit = hit + 1
      WHERE idx=${idx}
    `;
    await pool.execute(sql);
    sql = `
      SELECT *
      FROM freeboard
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

const listsCount = async () => {
  try {
    let sql = `
      SELECT COUNT(idx) AS count
      FROM freeboard
      WHERE record_status='2'
    `;
    const [[{ count }]] = await pool.execute(sql);
    return count;
  } catch (err) {
    throw new Error(err);
  }
};

const updateList = async (body, files) => {
  const {
    idx,
    mod_midx,
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
    is_secret,
    /*  */
    loginUser_member_id,
    member_id,
    company_name,
    user_name,
    phone,
    mobile,
    email,
    record_pw,
    /*  */
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
    let sql = ``;
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
    if (loginUser_member_id) {
      sql = `
        SELECT member_id FROM freeboard
        WHERE idx='${idx}'
      `;
      const [[rs]] = await pool.execute(sql);
      if (rs.member_id !== loginUser_member_id) {
        return { success: false };
      }
    } else {
      sql = `
        SELECT record_pw FROM freeboard
        WHERE idx='${idx}'
      `;
      const [[rs]] = await pool.execute(sql);

      if (rs.record_pw !== record_pw) {
        return { success: false };
      } else {
        sql += `
          , member_id=${member_id},
          company_name=${company_name},
          user_name=${user_name},
          phone=${phone},
          mobile=${mobile},
          email=${email}
        `;
      }
    }
    sql = `
      UPDATE freeboard SET title=?, title_font_weight=?, title_font_color=?, is_top_rank=?, auth_view=?, contents=?, mod_midx=?, mod_date=?, is_secret=?
    `;
    let values = [
      title,
      title_font_weight,
      title_font_color,
      is_top_rank,
      auth_view,
      contents,
      mod_midx,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      is_secret,
    ];

    if (contents1) {
      sql += `, contents1='${contents1}' `;
    }
    if (contents2) {
      sql += `, contents2='${contents2}' `;
    }
    if (contents3) {
      sql += `, contents3='${contents3}' `;
    }
    if (contents4) {
      sql += `, contents4='${contents4}' `;
    }
    if (contents5) {
      sql += `, contents5='${contents5}' `;
    }
    if (photo1) {
      sql += `, photo1='${photo1}' `;
    }
    if (photo2) {
      sql += `, photo2='${photo2}' `;
    }
    if (photo3) {
      sql += `, photo3='${photo3}' `;
    }
    if (photo4) {
      sql += `, photo4='${photo4}' `;
    }
    if (photo5) {
      sql += `, photo5='${photo5}' `;
    }
    if (attached_file1) {
      sql += `, attached_file1='${attached_file1}', attached_file1_oriname='${attached_file1_oriname}' `;
    }
    if (attached_file2) {
      sql += `, attached_file2='${attached_file2}', attached_file2_oriname='${attached_file2_oriname}' `;
    }
    sql += ` WHERE idx='${idx}' `;
    const [rs] = await pool.execute(sql, values);
    return rs.affectedRows === 1 ? { success: true } : { success: false };
  } catch (err) {
    throw new Error(err);
  }
};

const deleteImg = async (idx, col) => {
  try {
    let sql = `
      UPDATE freeboard SET ${col}=''
      WHERE idx='${idx}'
    `;
    const [rs] = await pool.execute(sql);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteList = async (idx) => {
  try {
    let sql = `
      UPDATE freeboard SET record_status = 9
      WHERE idx='${idx}'
    `;
    const [rs] = await pool.execute(sql);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

const likeList = async (idx) => {
  try {
    let sql = `
      UPDATE freeboard SET recommend = recommend + 1
      WHERE idx='${idx}'
    `;
    const [rs] = await pool.execute(sql);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  saveFreeBoard,
  findLists,
  findList,
  listsCount,
  updateList,
  deleteImg,
  deleteList,
  likeList,
};
