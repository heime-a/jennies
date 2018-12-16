'use strict;';


const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: String,
  address: String,
});

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: String,
  ingredients: [
    {
      ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
      },
      quantity: Number,
      unitCost: Number,
    },
  ],
  supplier: supplierSchema,
  poStatus: String,
  enum: ['Pending', 'Delivered'],
});


module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
