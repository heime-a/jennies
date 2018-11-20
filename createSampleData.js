/* eslint-disable no-console */
const mongoose = require('mongoose');


async function run() {
  mongoose.connect('mongodb://localhost/jennies');

  await mongoose.connection.dropDatabase();

  const supplierSchema = new mongoose.Schema({
    name: String,
    address: String,
  });

  const ingredientSchema = new mongoose.Schema({
    name: String,
    unit: String,
    enum: ['lb', 'oz', 'quart', 'gallon', 'singular'],
    type: String,
    // eslint-disable-next-line no-dupe-keys
    enum: ['Food', 'Packaging'],
  });


  const purchaseOrderSchema = new mongoose.Schema({
    poNumber: String,
    ingredients: [{
      ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
      },
      quantity: Number,
    }],
    supplier: supplierSchema,
    poStatus: String,
    enum: ['Pending', 'Delivered'],
  });


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

  const Ingredient = mongoose.model('Ingredient', ingredientSchema);
  await new Ingredient({ name: 'Eggs', type: 'Food', unit: 'Singular' }).save();
  await new Ingredient({ name: 'Flour', type: 'Food', unit: 'Lbs' }).save();
  await new Ingredient({ name: 'Sugar', type: 'Food', unit: 'Lbs' }).save();
  await new Ingredient({ name: 'Coconut Shredded', type: 'Food', unit: 'Lbs' }).save();


  const Purchaseorder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

  let purchaseorder = new Purchaseorder();
  purchaseorder.poNumber = 'HA0001';
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Eggs' }), quantity: 5 });
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Flour' }), quantity: 10 });
  purchaseorder.supplier = { name: 'heime', address: '123456' };
  await purchaseorder.save();

  purchaseorder = new Purchaseorder();
  purchaseorder.poNumber = 'HA0002';
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Eggs' }), quantity: 5 });
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Flour' }), quantity: 10 });
  purchaseorder.supplier = { name: 'heime', address: '123456' };
  await purchaseorder.save();

  purchaseorder = new Purchaseorder();
  purchaseorder.poNumber = 'HA0003';
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Eggs' }), quantity: 5 });
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Flour' }), quantity: 10 });
  purchaseorder.ingredients.push({
    ingredient: await Ingredient.findOne({ name: 'Coconut Shredded' }),
    quantity: 10,
  });

  purchaseorder.supplier = { name: 'heime', address: '123456' };

  await purchaseorder.save();


  const foo = await Purchaseorder.findOne({ poNumber: 'HA0003' }).populate('ingredients.ingredient');
  // eslint-disable-next-line no-restricted-syntax
  for (const i of foo.ingredients) {
    console.log(`quantity: ${i.quantity} ingredient name: ${i.ingredient.name}`);
  }

  const recipeSchema = new mongoose.Schema({
    name: String,
    ingredients: [{
      ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
      },
      quantity: Number,
    }],
    manHours: Number,
  });

  const Recipe = mongoose.model('Recipe', recipeSchema);

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
  await recipe2.save();

  console.log('Seed Data created correctly exiting express...');
  process.exit();
}


run().catch((error) => { console.error(error.stack); });
