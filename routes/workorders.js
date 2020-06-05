/* eslint-disable no-restricted-syntax */

'use strict;';

// @ts-check

const express = require('express');
const WorkOrder = require('../models/workorder');
const Recipe = require('../models/recipe');
const common = require('../common/common');


const router = express.Router();

function validateWorkOrder(recipeIngredients, inventory) {
  for (const i of recipeIngredients) {
    const itm = inventory.find(el => el.name === i.ingredient.name);
    if (itm === undefined || i.quantity > itm.quantity) {
      // eslint-disable-next-line no-console
      console.log(`Not Enough ${i.ingredient.name}`);
      return false;
    }
  }
  return true;
}

router.get('/', common.isAuthenticated, async (req, res) => {
  const allworkorders = await WorkOrder.find({}).populate('recipe');

  res.json({
    message: 'All WorkOrders',
    content: allworkorders,
  });
});

router.post('/', common.isAuthenticated, async (req, res) => {
  const {
    woNumber, recipe, startDate, status, actualHours, actualYield,
  } = req.body;

  const wo = new WorkOrder();

  wo.recipe = await Recipe.findOne({ name: recipe.name }).populate('ingredients.ingredient');

  wo.startDate = startDate;
  wo.status = status;
  wo.actualHours = actualHours;
  wo.actualYield = actualYield;
  wo.woNumber = woNumber;

  const inventory = await common.getCurrentInventory();

  const canManufacture = validateWorkOrder(wo.recipe.ingredients, inventory);

  if (!canManufacture) {
    res.json({ message: ` ERROR: Item not saved, Cant Make ${wo.recipe.name} there isn't enough inventory`, content: [wo.recipe, inventory] });
  } else {
    try {
      const savedWo = await wo.save();
      console.log(savedWo);
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

router.put('/:id', common.isAuthenticated, async (req, res) => {
  const {
    woNumber, recipe, startDate, status, actualHours, actualYield,
  } = req.body;

  const wo = {};

  wo.recipe = await Recipe.findOne({ name: recipe.name });
  wo.startDate = startDate;
  wo.status = status;
  wo.actualHours = actualHours;
  wo.actualYield = actualYield;
  wo.woNumber = woNumber;

  try {
    const updatedWO = await WorkOrder.findOneAndUpdate({ _id: req.params.id }, wo);
    console.log(updatedWO);
    res.json({
      message: `Updated work order ${updatedWO.woNumber}`,
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
