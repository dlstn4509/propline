const { pool } = require('../../../modules/mysql-md');
const moment = require('moment');

const saveBanner = async (body, files) => {
  try {
    let {
      reg_midx,
      site_id,
      area_code,
      title,
      start_date,
      end_date,
      is_on,
      link_count,
      link_target,
      link_type,
      /*  */
      link_url,
      /*  */
      movie1_url,
      movie1_position,
      movie1_display,
      window_width,
      window_height,
      /*  */
    } = body;
    let banner_image = '';
    let thumbImg01 = '';
    let thumbImg02 = '';
    let thumbImg03 = '';
    let thumbImg04 = '';
    let thumbImg05 = '';

    for (let [key, [val]] of Object.entries(files)) {
      let valArr = val.destination.split('\\');
      switch (key) {
        case 'banner_image':
          banner_image = `/${valArr[4]}/${valArr[5]}/${valArr[6]}/${valArr[7]}/${val.filename}`;
          break;
        case 'thumbImg01':
          thumbImg01 = `/${valArr[4]}/${valArr[5]}/${valArr[6]}/${valArr[7]}/${val.filename}`;
          break;
        case 'thumbImg02':
          thumbImg02 = `^/${valArr[4]}/${valArr[5]}/${valArr[6]}/${valArr[7]}/${val.filename}`;
          break;
        case 'thumbImg03':
          thumbImg03 = `^/${valArr[4]}/${valArr[5]}/${valArr[6]}/${valArr[7]}/${val.filename}`;
          break;
        case 'thumbImg04':
          thumbImg04 = `^/${valArr[4]}/${valArr[5]}/${valArr[6]}/${valArr[7]}/${val.filename}`;
          break;
        case 'thumbImg05':
          thumbImg05 = `^/${valArr[4]}/${valArr[5]}/${valArr[6]}/${valArr[7]}/${val.filename}`;
          break;
      }
    }

    let sql = `
      INSERT INTO banner SET
      site_id=?, area_code=?, title=?, link_count=?, start_date=?, end_date=?, is_on=?,
      reg_midx=?, mod_midx=?, banner_image=?
    `;
    let values = [
      site_id,
      area_code,
      title,
      link_count,
      start_date,
      end_date,
      is_on,
      reg_midx,
      reg_midx,
      banner_image,
    ];

    if (link_count === '1') {
      // 링크 있음
      sql += `, link_target=${link_target}, link_type=${link_type}`;
      if (link_target === '3') {
        sql += `, window_width='${window_width}, window_height='${window_height}'`;
      }
      if (link_type === '1') {
        // URL 입력
        sql += `, link_url='${link_url}'`;
      } else {
        // 이미지업로드(URL자동생성)
        sql += `
          , detail_image='${thumbImg01}${thumbImg02}${thumbImg03}${thumbImg04}${thumbImg05}', movie1_url='${movie1_url}', movie1_position='${movie1_position}',
          movie1_display='${movie1_display}'
        `;
      }
    }

    const [rs] = await pool.execute(sql, values);
    return rs;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { saveBanner };
