/* eslint-disable no-console */

'use strict;';

const express = require('express');
const common = require('../common/common');
const PurchaseOrder = require('../models/purchaseorders');
const Ingredient = require('../models/ingredient');

const router = express.Router();

/* GET purchaseOrders listing. */
router.get('/', async (req, res) => {
  const allPos = await PurchaseOrder.find({}).populate('ingredients.ingredient');
  res.json({
    message: 'All Purchase Orders',
    content: allPos,
  });
});

router.post('/', common.isAuthenticated, async (req, res) => {
  const { poNumber, supplier, ingredients } = req.body;
  const purchaseorder = new PurchaseOrder();
  purchaseorder.poNumber = poNumber;
  purchaseorder.supplier = supplier;

  // eslint-disable-next-line no-restricted-syntax
  for (const i of ingredients) {
    // eslint-disable-next-line no-await-in-loop
    const ingredient = await Ingredient.findOne({ name: i.ingredient.name });
    if (ingredient) {
      purchaseorder.ingredients.push({
        ingredient,
        quantity: i.quantity,
        unitCost: i.unitCost,
      });
    } else {
      res.json({
        message: `ERROR: New PO Not Saved ingredient ${i.ingredient.name} not found`,
        data: JSON.stringify(req.body),
      });
    }
  }
  try {
    await purchaseorder.save();
    res.json({
      success: true,
      message: 'Successfully Saved new record',
      data: JSON.stringify(purchaseorder),
    });
  } catch (err) {
    res.json({
      message: `ERROR: Record not saved: ${err.stack}`,
      data: JSON.stringify(purchaseorder),
    });
  }
});

router.put('/:id', common.isAuthenticated, async (req, res) => {
  const { poNumber, supplier, ingredients } = req.body;
  const purchaseorder = {};
  purchaseorder.poNumber = poNumber;
  purchaseorder.supplier = supplier;
  purchaseorder.ingredients = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const i of ingredients) {
    // eslint-disable-next-line no-await-in-loop
    const ingredient = await Ingredient.findOne({ name: i.ingredient.name });
    if (ingredient) {
      purchaseorder.ingredients.push({
        ingredient,
        quantity: i.quantity,
        unitCost: i.unitCost,
      });
    } else {
      res.json({
        success: false,
        message: 'ERROR: ingredient not found',
        data: JSON.stringify(req.body),
      });
    }
  }
  try {
    const updatedPO = await PurchaseOrder.findByIdAndUpdate(req.params.id, purchaseorder);
    res.json({
      success: true,
      message: 'Successfuly Updated record',
      data: JSON.stringify(updatedPO),
    });
  } catch (err) {
    res.json(404, {
      success: false,
      message: `ERROR: Record not updated: ${err.stack}`,
      data: JSON.stringify(purchaseorder),
    });
  }
});

module.exports = router;
