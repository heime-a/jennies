/* eslint-disable no-console */

'use strict;';

const express = require('express');
const CustomerOrder = require('../models/customerorders');
const Recipe = require('../models/recipe');

const router = express.Router();

/* GET CustomerOrders listing. */
router.get('/', async (req, res) => {
  const allPos = await CustomerOrder.find({});
  res.json({
    message: 'All Customer Orders',
    content: allPos,
  });
});

router.post('/', async (req, res) => {
  const { coNumber, customer, items } = req.body;
  const customerOrder = new CustomerOrder();
  customerOrder.coNumber = coNumber;
  customerOrder.customer = customer;

  // eslint-disable-next-line no-restricted-syntax
  for (const i of items) {
    // eslint-disable-next-line no-await-in-loop
    const recipe = await Recipe.findOne({ name: i.name });
    if (recipe) {
      customerOrder.items.push({
        name: i.name,
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

router.put('/:id', async (req, res) => {
  const { coNumber, customer, items } = req.body;
  console.log(`Saving: ${req.params.id} ${coNumber} ${customer} ${items}`);
  const customerOrder = {};
  customerOrder.coNumber = coNumber;
  customerOrder.customer = customer;
  customerOrder.items = [];


  // eslint-disable-next-line no-restricted-syntax
  for (const i of items) {
    // eslint-disable-next-line no-await-in-loop
    const recipe = await Recipe.findOne({ name: i.name });
    if (recipe) {
      customerOrder.items.push({
        name: i.name,
        quantity: i.quantity,
        unitCost: i.unitCost,
      });
    } else {
      res.json({
        message: 'ERROR: product  not found',
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
