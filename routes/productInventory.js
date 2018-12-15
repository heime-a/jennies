'use strict;';

const express = require('express');
const Workorder = require('../models/workorder');


const router = express.Router();

router.get('/', async (req, res) => {
  const response = await Workorder.aggregate([{
    $lookup: {
      from: 'recipes',
      localField: 'recipe',
      foreignField: '_id',
      as: 'recipe',
    },
  }, {
    $group: {
      _id: '$recipe.name',
      total: {
        $sum: '$actualYield',
      },
    },
  }]);

  res.json({
    message: 'productInventory',
    content: response,
  });
});

module.exports = router;
