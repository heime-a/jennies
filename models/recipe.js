

const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [{
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
    },
    quantity: Number,
  }],
  manHours: Number,
  expectedYield: Number,
  yieldUnits: String,
});

module.exports = mongoose.model('Recipe', recipeSchema);
