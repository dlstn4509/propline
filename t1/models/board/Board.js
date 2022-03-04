const axios = require('axios');
const { pool } = require('../../modules/mysql-md');

const findLists = async () => {
  try {
    let sql = `
      SELECT * FROM board
    `;
  } catch (err) {
    throw new Error(err);
  }
};
