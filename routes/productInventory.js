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

module.exports = router;
