'use strict;';

const express = require('express');
const PurchaseOrder = require('../models/purchaseorders');
const WorkOrder = require('../models/workorder');

const router = express.Router();

router.get('/manufactUsage', async (req, res) => {
  const response = await WorkOrder.aggregate([{
    $lookup: {
      from: 'recipes',
      localField: 'recipe',
      foreignField: '_id',
      as: 'recipe',
    },
  }, {
    $unwind: {
      path: '$recipe',

    },
  }, {
    $unwind: {
      path: '$recipe.ingredients',
    },
  }, {
    $group: {
      _id: '$recipe.ingredients.ingredient',
      Total: {
        $sum: '$recipe.ingredients.quantity',
      },
    },
  }, {
    $lookup: {
      from: 'ingredients',
      localField: '_id',
      foreignField: '_id',
      as: 'ing',
    },
  }, {
    $project: {
      'ing.name': 1,
      Total: 1,
    },
  }, {
    $unwind: {
      path: '$ingName',
    },
  }]);
  res.json({
    message: 'Inventory ',
    content: response,
  });
});

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
