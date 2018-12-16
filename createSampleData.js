/* eslint-disable no-console */
const mongoose = require('mongoose');
const Ingredient = require('./models/ingredient');
const Purchaseorder = require('./models/purchaseorders');
const Recipe = require('./models/recipe');
const WorkOrder = require('./models/workorder');

async function run() {
  mongoose.connect('mongodb://localhost/jennies');

  await mongoose.connection.dropDatabase();

  await new Ingredient({ name: 'Eggs', type: 'Food', unit: 'Singular' }).save();
  await new Ingredient({ name: 'Flour', type: 'Food', unit: 'Lbs' }).save();
  await new Ingredient({ name: 'Sugar', type: 'Food', unit: 'Lbs' }).save();
  await new Ingredient({ name: 'Coconut Shredded', type: 'Food', unit: 'Lbs' }).save();


  let purchaseorder = new Purchaseorder();
  purchaseorder.poNumber = 'HA0001';
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Eggs' }), quantity: 5, unitCost: 29.95 });
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Flour' }), quantity: 10, unitCost: 1.99 });
  purchaseorder.supplier = { name: 'heime', address: '123456' };
  await purchaseorder.save();

  purchaseorder = new Purchaseorder();
  purchaseorder.poNumber = 'HA0002';
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Eggs' }), quantity: 5, unitCost: 25.00 });
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Flour' }), quantity: 10, unitCost: 1.50 });
  purchaseorder.supplier = { name: 'heime', address: '123456' };
  await purchaseorder.save();

  purchaseorder = new Purchaseorder();
  purchaseorder.poNumber = 'HA0003';
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Eggs' }), quantity: 5, unitCost: 23.00 });
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Flour' }), quantity: 10, unitCost: 1.90 });
  purchaseorder.ingredients.push({
    ingredient: await Ingredient.findOne({ name: 'Coconut Shredded' }),
    quantity: 10,
    unitCost: 5.99,
  });

  purchaseorder.supplier = { name: 'heime', address: '123456' };

  await purchaseorder.save();


  const foo = await Purchaseorder.findOne({ poNumber: 'HA0003' }).populate('ingredients.ingredient');
  // eslint-disable-next-line no-restricted-syntax
  for (const i of foo.ingredients) {
    console.log(`quantity: ${i.quantity} ingredient name: ${i.ingredient.name}`);
  }


  const recipe = new Recipe();
  recipe.name = 'Vanilla Macaroons';
  recipe.manHours = 10;
  recipe.ingredients.push({
    ingredient: await Ingredient.findOne({ name: 'Eggs' }),
    quantity: 5,
  });
  recipe.ingredients.push({
    ingredient: await Ingredient.findOne({ name: 'Flour' }),
    quantity: 5,
  });
  recipe.ingredients.push({
    ingredient: await Ingredient.findOne({ name: 'Coconut Shredded' }),
    quantity: 10,
  });
  recipe.expectedYield = 100;
  recipe.yieldUnits = 'Case';
  await recipe.save();

  const recipe2 = new Recipe();
  recipe2.name = 'Chocolate Macaroons';
  recipe2.manHours = 10;
  recipe2.ingredients.push({
    ingredient: await Ingredient.findOne({ name: 'Eggs' }),
    quantity: 5,
  });
  recipe2.ingredients.push({
    ingredient: await Ingredient.findOne({ name: 'Flour' }),
    quantity: 5,
  });
  recipe2.ingredients.push({
    ingredient: await Ingredient.findOne({ name: 'Coconut Shredded' }),
    quantity: 10,
  });
  recipe2.expectedYield = 100;
  recipe2.yieldUnits = 'Case';
  await recipe2.save();

  const wo = new WorkOrder();
  wo.woNumber = 'wo0001';
  wo.recipe = await Recipe.findOne({ name: 'Vanilla Macaroons' });
  wo.startDate = Date.now();
  wo.status = 'Completed';
  wo.actualHours = 4;
  wo.actualYield = 100;
  wo.units = 'Case';
  await wo.save();

  const wo2 = new WorkOrder();
  wo2.woNumber = 'wo0002';
  wo2.recipe = await Recipe.findOne({ name: 'Chocolate Macaroons' });
  wo2.startDate = Date.now();
  wo2.status = 'Completed';
  wo2.actualHours = 4;
  wo2.actualYield = 200;
  wo2.units = 'Case';

  await wo2.save();


  console.log('Seed Data created correctly exiting express...');
  process.exit();
}


run().catch((error) => { console.error(error.stack); });


/* const supplierSchema = new mongoose.Schema({
    name: String,
    address: String,
  });
 */


/*  const materialsInventory = new mongoose.Schema({
    inventory: [{
      ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
      },
      quantity: Number,
    }],
  });
 */
