'use strict;';

const express = require('express'),
    router = express.Router(),
    PurchaseOrder = require("../models/purchaseorders"),
    Ingredient = require('../models/ingredient');

router.get('/' , async (req,res,next) => {

    response = await PurchaseOrder.aggregate([
        {
            '$unwind': {
                'path': '$ingredients'
            }
        }, {
            '$lookup': {
                'from': 'ingredients',
                'localField': 'ingredients.ingredient',
                'foreignField': '_id',
                'as': 'ingredients.ingredient'
            }
        }, {
            '$group': {
                '_id': '$ingredients.ingredient.name',
                'total': {
                    '$sum': '$ingredients.quantity'
                }
            }
        }
    ]);
    
    res.json({
        message: 'Inventory ',
        content: response.map(({_id,total})=>{return {name: _id[0],quantity: total}})
    });
});

module.exports = router;