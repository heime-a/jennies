'use strict;'
const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
    name: String,
    unit: String,
    enum: ["lb", "oz", "quart", "gallon", "singular"],
    type: String,
    enum: ["Food", "Packaging"]
});

module.exports = mongoose.model('Ingredient',ingredientSchema);
