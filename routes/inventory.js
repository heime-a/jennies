'use strict;';

// eslint-disable-next-line spaced-comment
//@ts-check

const express = require('express');
const common = require('../common/common');


const router = express.Router();


router.get('/purchTotals', async (req, res) => {
  res.json({
    message: 'PurchTotals',
    content: await common.getPurchases(),
  });
});

router.get('/manufactUsage', async (req, res) => {
  res.json({
    message: 'ManufactUsage',
    content: await common.getUsedIngredients(),
  });
});

router.get('/', common.isAuthenticated, async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('Cookies: ', req.cookies);
  res.json({
    message: 'Inventory ',
    content: await common.getCurrentInventory(),
  });
});

module.exports = router;
