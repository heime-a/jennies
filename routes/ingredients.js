/* eslint-disable no-console */

'use strict;';

const express = require('express');
const common = require('../common/common');
const Ingredient = require('../models/ingredient');

const router = express.Router();


/* GET ingredients listing. */
router.get('/', common.isAuthenticated, async (req, res) => {
  const ings = await Ingredient.find({});
  res.json({
    message: 'All Ingredients',
    content: ings,
  });
});


router.post('/', common.isAuthenticated, async (req, res) => {
  const { name, type, unit } = req.body;
  const ing = new Ingredient({ name, type, unit });
  await ing.save();
  res.json({
    message: 'Saved new record',
    data: ing,
  });
});

router.put('/:id', common.isAuthenticated, async (req, res) => {
  const { name, type, unit } = req.body;
  const ing = await Ingredient.findByIdAndUpdate(req.params.id, { name, type, unit });
  res.json({
    message: 'Updated record',
    data: ing,
  });
});

router.delete('/:id', common.isAuthenticated, async (req, res) => {
  await Ingredient.findByIdAndRemove(req.params.id);
  res.json({ message: `record ${req.params.id} removed` });
});


module.exports = router;
