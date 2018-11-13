'use strict;'
const express = require('express'),
    router = express.Router(),
    PurchaseOrder = require("../models/purchaseorders"),
    Ingredient = require('../models/ingredient');

router.get('/' , async (req,res,next)=> {

    response = await PurchaseOrder.aggregate([
        { $unwind: "$ingredients" },
        { $group: { _id: "$ingredients.ingredient", 
        total: { $sum: "$ingredients.quantity" } } }
    ]);
    
    res.json({
        message: 'Inventory ',
        content: response
    });
});

module.exports = router;