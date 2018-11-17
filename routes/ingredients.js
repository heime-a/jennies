'use strict;';

const express = require('express');
const Ingredient = require('../models/ingredient');

const router = express.Router();


/* GET ingredients listing. */
router.get('/', async (req, res) => {
  const ings = await Ingredient.find({});
  res.json({
    message: 'All Ingredients',
    content: ings,
  });
});


router.post('/', async (req, res) => {
  const { name, type, unit } = req.body;
  console.log(`post ingredient ${name} ${type} ${unit}`);
  const ing = new Ingredient({ name, type, unit });
  await ing.save();
  res.json({
    message: 'Saved new record',
    data: ing,
  });
});

router.put('/:id', async (req, res) => {
  const { name, type, unit } = req.body;
  const ing = await Ingredient.findByIdAndUpdate(req.params.id, { name, type, unit });
  res.json({
    message: 'Updated record',
    data: ing,
  });
});

router.delete('/:id', async (req, res) => {
  console.log('delete');
  await Ingredient.findByIdAndRemove(req.params.id);
  res.json({ message: `record ${req.params.id} removed` });
});


module.exports = router;
