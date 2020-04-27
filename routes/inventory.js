'use strict;';

// eslint-disable-next-line spaced-comment
//@ts-check

const express = require('express');
const common = require('../common/common');


const router = express.Router();


router.get('/purchTotals', common.isAuthenticated, async (req, res) => {
  res.json({
    message: 'PurchTotals',
    content: await common.getPurchases(),
  });
});

router.get('/manufactUsage', common.isAuthenticated, async (req, res) => {
  res.json({
    message: 'ManufactUsage',
    content: await common.getUsedIngredients(),
  });
});

router.get('/', common.isAuthenticated, async (req, res) => {
  res.json({
    message: 'Inventory ',
    content: await common.getCurrentInventory(),
  });
});

module.exports = router;
