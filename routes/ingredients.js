'use strict;'
const express = require('express'),
        router = express.Router(),
        Ingredient = require('../models/ingredient');


/* GET ingredients listing. */
router.get('/', async (req, res, next) => {

    ings = await Ingredient.find({});
    res.json({
        message: 'All Ingredients',
        content: ings
    });
});


router.post('/', async (req,res) => {
    const {name,type,unit} = req.body;
    console.log(`post ingredient ${name} ${type} ${unit}`);
    ing = new Ingredient({name:name, type:type,unit:unit});
    await ing.save();
    res.json({message: `Saved new record`,
                data: ing});
});

router.put('/:id', async (req,res) => {
    const { name, type, unit } = req.body;
    const ing = await Ingredient.findByIdAndUpdate(req.params.id, { name: name, type: type, unit: unit });
    res.json({
        message: `Updated record`,
        data: ing
    });

});

router.delete('/:id', async (req, res) => {
    console.log('delete');
    await Ingredient.findByIdAndRemove(req.params.id);
    res.json({message: `record ${req.params.id} removed`})
});


module.exports = router;