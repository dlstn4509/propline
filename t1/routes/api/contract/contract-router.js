const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { saveSaleContract } = require('../../../models/contract/ContractSale');
const { saveLeaseContract } = require('../../../models/contract/ContractLease');
const { saveRentalContract } = require('../../../models/contract/ContractRental');
const { saveShortContract } = require('../../../models/contract/ContractShort');
const { findContractLists } = require('../../../models/contract/ContractLIsts');

router.get('/', async (req, res, next) => {
  try {
    const { tradetype } = req.query;
    let type = tradetype === 'sale' ? '1' : tradetype === 'lease' ? '2' : tradetype === 'rental' ? '3' : ' 4';
    const lists = await findContractLists(type);
    res.status(200).json(lists);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    let trade_type = req.body.trade_type;
    // 매매
    if (trade_type === '1') {
      const rs = await saveSaleContract(req.body);
      res.status(200).json(rs);
    }
    // 전세
    else if (trade_type === '2') {
      const rs = await saveLeaseContract(req.body);
      res.status(200).json(rs);
    }
    // 월세
    else if (trade_type === '3') {
      const rs = await saveRentalContract(req.body);
      res.status(200).json(rs);
    }
    // 단기
    else {
      const rs = await saveShortContract(req.body);
      res.status(200).json(rs);
      // res.json(req.body);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
