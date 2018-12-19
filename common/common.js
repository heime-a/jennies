const PurchaseOrder = require('../models/purchaseorders');
const WorkOrder = require('../models/workorder');

module.exports.getPurchases = async () => {
  const response = await PurchaseOrder.aggregate([
    {
      $unwind: {
        path: '$ingredients',
      },
    }, {
      $lookup: {
        from: 'ingredients',
        localField: 'ingredients.ingredient',
        foreignField: '_id',
        as: 'ingredients.ingredient',
      },
    }, {
      $group: {
        _id: '$ingredients.ingredient.name',
        quantity: {
          $sum: '$ingredients.quantity',
        },
        cost: {
          $sum: { $multiply: ['$ingredients.quantity', '$ingredients.unitCost'] },
        },
      },
    },
    {
      $unwind: {
        path: '$_id',
      },
    },
  ]);
  // eslint-disable-next-line max-len
  return response.map(({ _id, quantity, cost }) => ({ name: _id, quantity, avgCost: cost / quantity }));
};


module.exports.getUsedIngredients = async () => {
  const response = await WorkOrder.aggregate([{
    $lookup: {
      from: 'recipes',
      localField: 'recipe',
      foreignField: '_id',
      as: 'recipe',
    },
  }, {
    $unwind: {
      path: '$recipe',

    },
  }, {
    $unwind: {
      path: '$recipe.ingredients',
    },
  }, {
    $group: {
      _id: '$recipe.ingredients.ingredient',
      Total: {
        $sum: '$recipe.ingredients.quantity',
      },
    },
  }, {
    $lookup: {
      from: 'ingredients',
      localField: '_id',
      foreignField: '_id',
      as: 'ing',
    },
  }, {
    $project: {
      'ing.name': 1,
      Total: 1,
    },
  }, {
    $unwind: {
      path: '$ing',
    },
  }]);
  return response.map(({ ing, Total }) => ({ name: ing.name, quantity: Total }));
};


module.exports.getCurrentInventory = async () => {
  const purch = await module.exports.getPurchases();
  const used = await module.exports.getUsedIngredients();

  return purch.map((i) => {
    const usedIng = used.find(e => e.name === i.name);
    if (usedIng === undefined) return { name: i.name, quantity: i.quantity, avgCost: i.avgCost };
    return { name: i.name, quantity: i.quantity - usedIng.quantity, avgCost: i.avgCost };
  });
};
