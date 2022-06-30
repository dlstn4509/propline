const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { saveSaleContract } = require('../../../models/contract/ContractSale');
const { saveLeaseContract } = require('../../../models/contract/ContractLease');
const { saveRentalContract } = require('../../../models/contract/ContractRental');
const { saveShortContract } = require('../../../models/contract/ContractShort');
const { findContractLists } = require('../../../models/contract/ContractLIsts');
const { findContract } = require('../../../models/contract/FindContract');
const { UpdateSale } = require('../../../models/contract/UpdateSale');
const { UpdateLease } = require('../../../models/contract/UpdateLease');
const { UpdateRental } = require('../../../models/contract/UpdateRental');
const { UpdateShort } = require('../../../models/contract/UpdateShort');
const { deleteContract } = require('../../../models/contract/DeleteContract');

router.delete('/', async (req, res, next) => {
  try {
    const { idx } = req.query;
    const rs = await deleteContract(idx);
    res.status(200).json(rs);
    // res.status(200).json(idx);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { tradetype, idx } = req.query;
    if (tradetype) {
      let type =
        tradetype === 'sale' ? '1' : tradetype === 'lease' ? '2' : tradetype === 'rental' ? '3' : ' 4';
      const lists = await findContractLists(type);
      res.status(200).json(lists);
    } else {
      const contract = await findContract(idx);
      res.status(200).json(contract);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    let trade_type = req.body.trade_type;
    // 매매
    if (trade_type === 'sale') {
      const rs = await UpdateSale(req.body);
      if (rs.affectedRows === 1) {
        res.status(200).redirect('/contract');
      } else {
        next(err);
      }
    }
    // 전세
    else if (trade_type === 'lease') {
      const rs = await UpdateLease(req.body);
      if (rs.affectedRows === 1) {
        res.status(200).redirect('/contract');
      } else {
        next(err);
      }
    }
    // 월세
    else if (trade_type === 'rental') {
      const rs = await UpdateRental(req.body);
      if (rs.affectedRows === 1) {
        res.status(200).redirect('/contract');
      } else {
        next(err);
      }
    }
    // 단기
    else {
      const rs = await UpdateShort(req.body);
      if (rs.affectedRows === 1) {
        res.status(200).redirect('/contract');
      } else {
        next(err);
      }
      // res.status(200).json(req.body);
    }
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
      if (rs.affectedRows === 1) {
        res.status(200).redirect('/contract');
      } else {
        next(err);
      }
    }
    // 전세
    else if (trade_type === '2') {
      const rs = await saveLeaseContract(req.body);
      if (rs.affectedRows === 1) {
        res.status(200).redirect('/contract');
      } else {
        next(err);
      }
    }
    // 월세
    else if (trade_type === '3') {
      const rs = await saveRentalContract(req.body);
      if (rs.affectedRows === 1) {
        res.status(200).redirect('/contract');
      } else {
        next(err);
      }
    }
    // 단기
    else {
      const rs = await saveShortContract(req.body);
      if (rs.affectedRows === 1) {
        res.status(200).redirect('/contract');
      } else {
        next(err);
      }
      // res.json(req.body);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = { name: '/', router };
