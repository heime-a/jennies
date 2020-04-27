'use strict;';

const express = require('express');
const common = require('../common/common');
const Ingredient = require('../models/ingredient');
const Recipe = require('../models/recipe');

const router = express.Router();

router.get('/', async (req, res) => {
  const allrecipes = await Recipe.find({}).populate('ingredients.ingredient');

  res.json({
    message: 'All Recipes',
    content: allrecipes,
  });
});

router.post('/', common.isAuthenticated, async (req, res) => {
  const { name, manHours, ingredients } = req.body;
  const recipe = new Recipe();
  recipe.name = name;
  recipe.manHours = manHours;
  recipe.ingredients = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const i of ingredients) {
    // eslint-disable-next-line no-await-in-loop
    const ingredient = await Ingredient.findOne({ name: i.ingredient.name });
    if (ingredient) {
      recipe.ingredients.push({ ingredient, quantity: i.quantity });
    } else {
      res.json({
        message: 'ingredient not found',
        data: req.body,
      });
    }
  }

  try {
    await recipe.save();
    res.json({
      message: 'Saved new record',
      data: recipe,
    });
  } catch (error) {
    res.json({
      message: 'Record not saved',
      data: recipe,
    });
  }
});

router.put('/:id', common.isAuthenticated, async (req, res) => {
  const { name, manHours, ingredients } = req.body;
  console.log(`Saving: ${req.params.id} ${name} ${manHours} ${ingredients}`);
  const recipe = {};
  recipe.name = name;
  recipe.manHours = manHours;
  recipe.ingredients = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const i of ingredients) {
    // eslint-disable-next-line no-await-in-loop
    const ingredient = await Ingredient.findOne({ name: i.ingredient.name });
    if (ingredient) {
      recipe.ingredients.push({
        ingredient,
        quantity: i.quantity,
      });
    } else {
      res.json({
        message: 'ingredient not found',
        data: JSON.stringify(req.body),
      });
    }
  }
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, recipe);
    res.json({
      message: 'Updated new record',
      data: JSON.stringify(updatedRecipe),
    });
  } catch (err) {
    res.json({
      message: `Record not updated : ${err.stack}`,
      data: recipe,
    });
  }
});

module.exports = router;
