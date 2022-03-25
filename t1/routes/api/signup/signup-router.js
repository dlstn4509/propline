const path = require('path');
const express = require('express');
const router = express.Router();

const uploadCompanyNoFile = require('../../../middlewares/multerCompanyNoFile-mw'); // 사업자 등록증
const { saveCompany } = require('../../../models/signup/companySignup');
const { makeFileName } = require('../../../middlewares/makeFileName');
const { saveCompanyMember, isIdDuplication } = require('../../../models/signup/companyMember');

router.get('/idduplication', async (req, res, next) => {
  try {
    const { id } = req.query;
    const rs = await isIdDuplication(id);
    res.status(200).json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post(
  '/',
  uploadCompanyNoFile.fields([{ name: 'company_no_file' }, { name: 'registration_no_file' }]),
  async (req, res, next) => {
    try {
      const fileObj = await makeFileName(req.files);
      const [company] = await saveCompany(req.body, fileObj);
      const companyMember = await saveCompanyMember(req.body, company.insertId);
      // const companyMember = await saveCompanyMember(req.body, '1');
      // res.json(companyMember);
      // res.json(rs);
      res.status(200).redirect('https://t1.propline.co.kr/main');
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = { name: '/', router };
