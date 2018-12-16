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
  },
  {
    $unwind: {
      path: '$_id',
    },
  },
  ]);

  res.json({
    message: 'productInventory',
    content: response.map(({ _id, total }) => ({ name: _id, quantity: total })),
  });
});

module.exports = router;
