'use strict;';


const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: String,
  address: String,
});

const customerOrderSchema = new mongoose.Schema({
  poNumber: String,
  items: [
    {
      recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
      },
      quantity: Number,
      unitCost: Number,
    },
  ],
  supplier: supplierSchema,
  poStatus: String,
  enum: ['Pending', 'Delivered'],
});


module.exports = mongoose.model('PurchaseOrder', customerOrderSchema);
