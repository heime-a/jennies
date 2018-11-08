const express = require("express"),
  router = express.Router(),
  PurchaseOrder = require("../models/purchaseorders"),
  Ingredient = require("../models/ingredient");

/* GET purchaseOrders listing. */
router.get("/", async function(req, res, next) {
  allPos = await PurchaseOrder.find({}).populate("ingredients.ingredient");
  res.json({
    message: "All Purchase Orders",
    content: allPos
  });
});

router.post("/", async (req, res, next) => {
  const { poNumber, supplier, ingredients } = req.body;
  purchaseorder = new PurchaseOrder();
  purchaseorder.poNumber = poNumber;
  purchaseorder.supplier = supplier;

  for (i of ingredients) {
    const ingredient = await Ingredient.findOne({ name: i.ingredient.name });
    if (ingredient) {
      purchaseorder.ingredients.push({
        ingredient: ingredient,
        quantity: i.quantity
      });
    }
    else {
      res.json({
        message: `ingredient not found`,
        data: JSON.stringify(req.body)
      });
    }
  }
  try {
    await purchaseorder.save();
    res.json({
      message: `Saved new record`,
      data: JSON.stringify(purchaseorder)
    });
  }
  catch(err) { 
    res.json({
      message: `Record not saved`,
      data: JSON.stringify(purchaseorder)
    });

  }

});

router.put("/:id", async (req, res) => {
  const { poNumber, supplier, ingredients } = req.body;
  purchaseorder = {};
  purchaseorder.poNumber = poNumber;
  purchaseorder.supplier = supplier;
  purchaseorder.ingredients = [];

  for (i of ingredients) {
    const ingredient = await Ingredient.findOne({ name: i.ingredient.name });
    if (ingredient) {
      purchaseorder.ingredients.push({
        ingredient: ingredient,
        quantity: i.quantity
      });
    }
    else {
      res.json({
        message: `ingredient not found`,
        data: JSON.stringify(req.body)
      });
    }
  }
  try {
    purchaseorder = await PurchaseOrder.findByIdAndUpdate(req.params.id, purchaseorder);

    res.json({
      message: `Updated new record`,
      data: JSON.stringify(purchaseorder)
    });
  }
  catch(err) { 
    res.json({
      message: `Record not updated`,
      data: JSON.stringify(purchaseorder)
    });

  }

});

module.exports = router;
