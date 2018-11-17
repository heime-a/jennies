'use strict;';

const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: String,
  unit: String,
  enum: ['lb', 'oz', 'quart', 'gallon', 'singular'],
  type: String,
  // eslint-disable-next-line no-dupe-keys
  enum: ['Food', 'Packaging'],
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
