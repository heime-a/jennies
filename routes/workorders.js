/* eslint-disable no-restricted-syntax */

'use strict;';

// @ts-check

const express = require('express');
const WorkOrder = require('../models/workorder');
const Recipe = require('../models/recipe');
const PurchaseOrder = require('../models/purchaseorders');

const router = express.Router();

function validateWorkOrder(recipeIngredients, inventory) {
  for (const i of recipeIngredients) {
    const itm = inventory.find(el => el.name === i.ingredient.name);
    if (i.quantity > itm.quantity) {
      return false;
    }
  }
  return true;
}

async function getInventory() {
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
  return response.map(({ _id, total }) => ({ name: _id[0], quantity: total }));
}


router.get('/', async (req, res) => {
  const allworkorders = await WorkOrder.find({}).populate('recipe');

  res.json({
    message: 'All WorkOrders',
    content: allworkorders,
  });
});

router.post('/', async (req, res) => {
  const {
    woNumber, recipe, startDate, status, actualHours,
  } = req.body;

  const wo = new WorkOrder();

  wo.recipe = await Recipe.findOne({ name: recipe.name }).populate('ingredients.ingredient');

  wo.startDate = startDate;
  wo.status = status;
  wo.actualHours = actualHours;
  wo.woNumber = woNumber;

  const inventory = await getInventory();

  const canManufacture = validateWorkOrder(wo.recipe.ingredients, inventory);

  if (!canManufacture) {
    res.json({ message: ' Cant Make this not enough inventory', content: [wo.recipe, inventory] });
  } else {
    try {
      const savedWo = await wo.save();
      res.json({
        message: 'WorkOrder Saved',
        content: savedWo,
      });
    } catch (error) {
      res.json({
        message: 'Workorder not saved',
        content: error,
      });
    }
  }
});

router.put('/:id', async (req, res) => {
  const {
    woNumber, recipe, startDate, status, actualHours,
  } = req.body;

  const wo = {};

  wo.recipe = await Recipe.findOne({ name: recipe.name });
  wo.startDate = startDate;
  wo.status = status;
  wo.actualHours = actualHours;
  wo.woNumber = woNumber;

  try {
    const updatedWO = await WorkOrder.findOneAndUpdate({ _id: req.params.id }, wo);
    res.json({
      message: 'Updated work order',
      content: updatedWO,
    });
  } catch (error) {
    res.json({
      message: 'Update failed',
      content: error,
    });
  }
});

module.exports = router;
