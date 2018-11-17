'use strict;';

const express = require('express');
const PurchaseOrder = require('../models/purchaseorders');


const router = express.Router();

router.get('/', async (req, res) => {
  const response = await PurchaseOrder.aggregate([
    {
      $unwind: {
        path: '$ingredients',
      },
    }, {
      $lookup: {
        from: 'ingredients',
        localField: 'ingredients.ingredient',
        foreignField: '_id',
        as: 'ingredients.ingredient',
      },
    }, {
      $group: {
        _id: '$ingredients.ingredient.name',
        total: {
          $sum: '$ingredients.quantity',
        },
      },
    },
  ]);

  res.json({
    message: 'Inventory ',
    content: response.map(({ _id, total }) => ({ name: _id[0], quantity: total })),
  });
});

module.exports = router;