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
    let thumbImg = '';

    for (let [[key], val] of Object.entries(files)) {
      let valArr = val.destination.split('\\');
      if (val.fieldname === 'banner_image') {
        banner_image = `/${valArr[4]}/${valArr[5]}/${valArr[6]}/${valArr[7]}/${val.filename}`;
      }
      if (val.fieldname.includes('thumbImg')) {
        thumbImg += `/${valArr[4]}/${valArr[5]}/${valArr[6]}/${valArr[7]}/${val.filename}^`;
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
        sql += `, window_width='${window_width}', window_height='${window_height}'`;
      }
      if (link_type === '1') {
        // URL 입력
        sql += `, link_url='${link_url}'`;
      } else {
        // 이미지업로드(URL자동생성)
        thumbImg = thumbImg.substring(0, thumbImg.length - 1);
        sql += `
          , detail_image='${thumbImg}'
        `;
        if (movie1_url) {
          // 유투브 동영상 URL 있으면
          sql += `
          , movie1_url='${movie1_url}', movie1_position='${movie1_position}',
          movie1_display='${movie1_display}'
          `;
        }
      }
    }
    const [rs] = await pool.execute(sql, values);
    return rs;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const findLists = async (site_id, area_code) => {
  try {
    let sql = `
      SELECT idx, title, banner_image, order_no, start_date, end_date,
      is_on, mod_date, view_count, click_count, link_url
      FROM banner
      WHERE site_id=${site_id} 
    `;
    if (area_code) {
      sql += `AND area_code=${area_code}`;
    }
    const [lists] = await pool.execute(sql);
    for (let v of lists) {
      let bannerArr = v.banner_image.split('/');
      v.banner_image = `uploads/${bannerArr[2]}/${bannerArr[3]}/${bannerArr[4]}/${bannerArr[5]}`;
      v.start_date = moment(v.start_date).format('YYYY-MM-DD');
      v.end_date = moment(v.end_date).format('YYYY-MM-DD');
      v.mod_date = moment(v.mod_date).format('YYYY-MM-DD HH:mm:ss');
      v.is_on_color = v.is_on === 1 ? '' : 'blue';
      v.is_on = v.is_on === 1 ? '게시안함' : '게시함';
    }
    return lists;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const findList = async (idx) => {
  try {
    let sql = `
      SELECT * FROM banner
      WHERE idx='${idx}'
    `;
    const [[list]] = await pool.execute(sql);
    let bannerArr = list.banner_image.split('/');
    list.banner_image_src = `uploads/${bannerArr[2]}/${bannerArr[3]}/${bannerArr[4]}/${bannerArr[5]}`;
    list.start_date = moment(list.start_date).format('YYYY-MM-DD');
    list.end_date = moment(list.end_date).format('YYYY-MM-DD');

    if (list.detail_image) {
      let detail_imageArr = list.detail_image.split('^');
      list.detail_imageArr = [];
      for (let v of detail_imageArr) {
        let detail_image_srcArr = v.split('/');
        list.detail_imageArr.push({
          src: `uploads/${detail_image_srcArr[2]}/${detail_image_srcArr[3]}/${detail_image_srcArr[4]}/${detail_image_srcArr[5]}`,
          path: v,
        });
      }
    }
    return list;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const updateThumb = async (idx, path) => {
  try {
    let sql = '';
    sql = `
      SELECT detail_image FROM banner
      WHERE idx='${idx}'
    `;
    const [[{ detail_image }]] = await pool.execute(sql);
    let newDetail_image = detail_image
      .split('^')
      .filter((v) => {
        return v !== path;
      })
      .join('^');
    sql = `
      UPDATE banner SET detail_image='${newDetail_image}'
      WHERE idx='${idx}'
    `;
    const [rs] = await pool.execute(sql);
    return rs;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const updateBanner = async (body, files) => {
  try {
    let {
      idx,
      mod_midx,
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
    let sql = '';
    let banner_image = '';
    let thumbImg = '';

    sql = `
      SELECT detail_image FROM banner
      WHERE idx='${idx}'
    `;
    const [[{ detail_image }]] = await pool.execute(sql);
    thumbImg = detail_image;

    for (let [[key], val] of Object.entries(files)) {
      let valArr = val.destination.split('\\');
      if (val.fieldname === 'banner_image') {
        banner_image = `/${valArr[4]}/${valArr[5]}/${valArr[6]}/${valArr[7]}/${val.filename}`;
      }
      if (val.fieldname.includes('thumbImg')) {
        if (thumbImg) {
          thumbImg += `^/${valArr[4]}/${valArr[5]}/${valArr[6]}/${valArr[7]}/${val.filename}^`;
        } else {
          thumbImg += `/${valArr[4]}/${valArr[5]}/${valArr[6]}/${valArr[7]}/${val.filename}^`;
        }
        thumbImg = thumbImg.substring(0, thumbImg.length - 1);
      }
    }
    sql = `
      UPDATE banner SET
      site_id=?, area_code=?, title=?, link_count=?, start_date=?, end_date=?, is_on=?,
      mod_midx=?, mod_date=?
    `;
    let values = [
      site_id,
      area_code,
      title,
      link_count,
      start_date,
      end_date,
      is_on,
      mod_midx,
      moment().format('YYYY-MM-DD HH:mm:ss'),
    ];
    if (banner_image) {
      sql += `
        , banner_image='${banner_image}'
      `;
    }
    if (link_count === '1') {
      // 링크 있음
      // sql += `, link_target=${link_target}, link_type='${link_type}'`;
      if (link_target === '3') {
        sql += `, window_width='${window_width}, window_height='${window_height}'`;
      }
      if (link_type === '1') {
        // URL 입력
        sql += `, link_url='${link_url}'`;
      } else {
        // 이미지업로드(URL자동생성)
        sql += `
          , detail_image='${thumbImg}'
        `;
        if (movie1_url) {
          // 유투브 동영상 URL 있으면
          sql += `
          , movie1_url='${movie1_url}', movie1_position=${movie1_position},
          movie1_display='${movie1_display}'
          `;
        }
      }
    }
    sql += `
      WHERE idx='${idx}'
    `;
    const [rs] = await pool.execute(sql, values);
    return rs;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

module.exports = { saveBanner, findLists, findList, updateThumb, updateBanner };
