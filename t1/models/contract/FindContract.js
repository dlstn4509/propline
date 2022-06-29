const { pool } = require('../../modules/mysql-md');
const moment = require('moment');

const makeTxt = (num) => {
  let text = num.split(',').join('');
  let numKor = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십'];
  let danKor = ['', '십', '백', '천', '', '십', '백', '천', '', '십', '백', '천', '', '십', '백', '천'];
  let result = '';

  if (text && !isNaN(text)) {
    for (let i = 0; i < text.length; i++) {
      let str = '';
      let num = numKor[text.charAt(text.length - (i + 1))];
      if (num !== '') str += num + danKor[i];
      switch (i) {
        case 4:
          str += '만';
          break;
        case 8:
          str += '억';
          break;
        case 12:
          str += '조';
          break;
        default:
      }
      result = str + result;
    }
    result = result + '원';
  }
  if (result.indexOf('만') - result.indexOf('억') === 1) result = result.replace('만', '');
  if (result.indexOf('억') - result.indexOf('조') === 1) result = result.replace('억', '');
  return result;
};

const findContract = async (idx) => {
  try {
    let sql = `
      SELECT * FROM contract
      WHERE idx=${idx}
    `;
    const [[contract]] = await pool.execute(sql);

    contract.contract_start_date = moment(contract.contract_start_date).format('YYYY-MM-DD');
    contract.contract_finish_date = moment(contract.contract_finish_date).format('YYYY-MM-DD');
    contract.interim1_date = moment(contract.interim1_date).format('YYYY-MM-DD');
    contract.interim2_date = moment(contract.interim2_date).format('YYYY-MM-DD');
    contract.balance_date = moment(contract.balance_date).format('YYYY-MM-DD');
    contract.contract_date = moment(contract.contract_date).format('YYYY-MM-DD');

    contract.selling_amount = contract.selling_amount.toLocaleString('ko-KR');
    contract.security = contract.security.toLocaleString('ko-KR');
    contract.earnest = contract.earnest.toLocaleString('ko-KR');
    contract.interim1_amount = contract.interim1_amount.toLocaleString('ko-KR');
    contract.interim2_amount = contract.interim2_amount.toLocaleString('ko-KR');
    contract.balance = contract.balance.toLocaleString('ko-KR');
    contract.loan_amount = contract.loan_amount.toLocaleString('ko-KR');
    contract.monthly_rent = contract.monthly_rent.toLocaleString('ko-KR');

    contract.selling_amount_txt = makeTxt(contract.selling_amount);
    contract.security_txt = makeTxt(contract.security);
    contract.earnest_txt = makeTxt(contract.earnest);
    contract.interim1_amount_txt = makeTxt(contract.interim1_amount);
    contract.interim2_amount_txt = makeTxt(contract.interim2_amount);
    contract.balance_txt = makeTxt(contract.balance);
    contract.loan_amount_txt = makeTxt(contract.loan_amount);
    contract.monthly_rent_txt = makeTxt(contract.monthly_rent);

    return contract;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { findContract };
