

const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  woNumber: String,
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
  },
  startDate: Date,
  status: String,
  actualHours: Number,
  actualYield: Number,
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);
