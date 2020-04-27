const PurchaseOrder = require('../models/purchaseorders');
const WorkOrder = require('../models/workorder');
const CustomerOrder = require('../models/customerorders');

const UserSession = require('../models/usersession');

module.exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = JSON.parse(req.cookies.token);
    const result = await UserSession.findOne({ _id: token, isDeleted: false });
    if (result) next();
    else res.send({ message: 'Error', content: 'Route not Authenticated: No session found' });
  } catch (err) {
    res.send({ message: 'Error', content: `Route not Authenticated: ${err.stack}` });
  }
};

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

module.exports.getCurrentProductInventory = async () => {
  const production = await module.exports.getAggregateWOProduction();
  const customerOrders = await module.exports.getAggregateCustomerOrders();

  return production.map((i) => {
    const ordered = customerOrders.find(e => e.name === i.name);
    if (ordered === undefined) return ({ name: i.name, quantity: i.quantity });
    return ({ name: i.name, quantity: i.quantity - ordered.quantity });
  });
};

module.exports.getAggregateWOProduction = async () => {
  const response = await WorkOrder.aggregate([{
    $lookup: {
      from: 'recipes',
      localField: 'recipe',
      foreignField: '_id',
      as: 'recipe',
    },
  }, {
    $group: {
      _id: '$recipe.name',
      total: {
        $sum: '$actualYield',
      },
    },
  },
  {
    $unwind: {
      path: '$_id',
    },
  },
  ]);
  return response.map(({ _id, total }) => ({ name: _id, quantity: total }));
};

module.exports.getAggregateCustomerOrders = async () => {
  const response = await CustomerOrder.aggregate([{
    $unwind: {
      path: '$items',
    },
  }, {
    $group: {
      _id: '$items.name',
      total: {
        $sum: '$items.quantity',
      },
    },
  }]);
  return response.map(({ _id, total }) => ({ name: _id, quantity: total }));
};
