'use strict;';

// @ts-check

const express = require('express');
const WorkOrder = require('../models/workorder');
const Recipe = require('../models/recipe');

const router = express.Router();


router.get('/', async (req, res) => {
  const allworkorders = await WorkOrder.find({}).populate('recipe');

  res.json({
    message: 'All WorkOrders',
    content: allworkorders,
  });
});

router.post('/', async (req, res) => {
  const {
    recipe, startDate, status, actualHours,
  } = req.body;

  const wo = new WorkOrder();

  wo.recipe = await Recipe.findOne({ name: recipe.name });

  wo.startDate = startDate;
  wo.status = status;
  wo.actualHours = actualHours;
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
});

router.put('/:id', async (req, res) => {
  const {
    recipe, startDate, status, actualHours,
  } = req.body;

  const wo = {};

  wo.recipe = await Recipe.findOne({ name: recipe.name });

  

  //wo.recipe = recipe;
  wo.startDate = startDate;
  wo.status = status;
  wo.actualHours = actualHours;
  try {
    const updatedWO = await WorkOrder.findByIdAndUpdate(req.params.id, wo);
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
