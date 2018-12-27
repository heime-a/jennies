/* eslint-disable no-console */

'use strict;';

const express = require('express');
const CustomerOrder = require('../models/customerorders');
const Recipe = require('../models/recipe');

const router = express.Router();

/* GET CustomerOrders listing. */
router.get('/', async (req, res) => {
  const allPos = await CustomerOrder.find({}).populate('items.recipe');
  res.json({
    message: 'All Customer Orders',
    content: allPos,
  });
});

router.post('/', async (req, res) => {
  const { poNumber, supplier, items } = req.body;
  const customerOrder = new CustomerOrder();
  customerOrder.poNumber = poNumber;
  customerOrder.supplier = supplier;

  // eslint-disable-next-line no-restricted-syntax
  for (const i of items) {
    // eslint-disable-next-line no-await-in-loop
    const recipe = await Recipe.findOne({ name: i.ingredient.name });
    if (recipe) {
      customerOrder.items.push({
        recipe,
        quantity: i.quantity,
        unitCost: i.unitCost,
      });
    } else {
      res.json({
        message: `ERROR: New PO Not Saved product ${i.product.name} not found`,
        data: JSON.stringify(req.body),
      });
    }
  }
  try {
    await customerOrder.save();
    res.json({
      message: 'Successfully Saved new record',
      data: JSON.stringify(customerOrder),
    });
  } catch (err) {
    res.json({
      message: `ERROR: Record not saved: ${err.stack}`,
      data: JSON.stringify(customerOrder),
    });
  }
});

// TODO: Copy paste modify

router.put('/:id', async (req, res) => {
  const { poNumber, supplier, items } = req.body;
  console.log(`Saving: ${req.params.id} ${poNumber} ${supplier} ${items}`);
  const customerOrder = {};
  customerOrder.poNumber = poNumber;
  customerOrder.supplier = supplier;
  customerOrder.items = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const i of items) {
    // eslint-disable-next-line no-await-in-loop
    const ingredient = await Recipe.findOne({ name: i.recipe.name });
    if (ingredient) {
      customerOrder.items.push({
        ingredient,
        quantity: i.quantity,
        unitCost: i.unitCost,
      });
    } else {
      res.json({
        message: 'ERROR: recipe not found',
        data: JSON.stringify(req.body),
      });
    }
  }
  try {
    console.log(`before save ${JSON.stringify(customerOrder.items)}`);
    const updatedPO = await CustomerOrder.findByIdAndUpdate(req.params.id, customerOrder);
    console.log(`after  save ${JSON.stringify(updatedPO)}`);
    res.json({
      message: 'Successfuly Updated record',
      data: JSON.stringify(updatedPO),
    });
  } catch (err) {
    res.json({
      message: `ERROR: Record not updated: ${err.stack}`,
      data: JSON.stringify(customerOrder),
    });
  }
});

module.exports = router;
