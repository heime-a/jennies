'use strict;';

const express = require('express');
const common = require('../common/common');


const router = express.Router();

router.get('/', async (req, res) => {
  res.json({
    message: 'productInventory',
    content: await common.getCurrentProductInventory(),
  });
});

router.get('/aggCustomerOrders', async (req, res) => {
  res.json({
    message: 'customerOrders',
    content: await common.getAggregateCustomerOrders(),
  });
});

router.get('/aggProduction', async (req, res) => {
  res.json({
    message: 'production',
    content: await common.getAggregateWOProduction(),
  });
});


module.exports = router;
