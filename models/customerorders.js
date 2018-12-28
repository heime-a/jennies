'use strict;';


const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  address: String,
});

const customerOrderSchema = new mongoose.Schema({
  coNumber: String,
  items: [
    {
      name: String,
      quantity: Number,
      unitCost: Number,
    },
  ],
  customer: customerSchema,
  coStatus: String,
  enum: ['Pending', 'Delivered'],
});


module.exports = mongoose.model('CustomerOrder', customerOrderSchema);
