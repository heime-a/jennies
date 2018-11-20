'use strict;';

const express = require('express');
// const Ingredient = require('../models/ingredient');
const Recipe = require('../models/recipe');

const router = express.Router();

router.get('/', async (req, res) => {
  const allrecipes = await Recipe.find({});

  res.json({
    message: 'All Recipes',
    content: allrecipes,
  });
});

module.exports = router;
