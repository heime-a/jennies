const mongoose = require("mongoose");


async function run() {
  
  mongoose.connect("mongodb://localhost/jennies");

  await mongoose.connection.dropDatabase();

  const supplierSchema = new mongoose.Schema({
    name: String,
    address: String
  });

  const ingredientSchema = new mongoose.Schema({
    name: String,
    unit: String,
    enum: ["lb", "oz", "quart", "gallon", "singular"],
    type: String,
    enum: ["Food", "Packaging"]
  });
  
 
  const purchaseOrderSchema = new mongoose.Schema({
    poNumber: String,
    ingredients: [{
        ingredient : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        quantity : Number
    }],
    supplier: supplierSchema,
    poStatus: String, 
    enum:['Pending','Delivered']
  });


  const materialsInventory = new mongoose.Schema({
    inventory: [{
      ingredient : {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Ingredient'
      },
      quantity : Number
  }]
  });
  
  
  const Ingredient = mongoose.model('Ingredient', ingredientSchema);
  await new Ingredient({ name: "Eggs", type: "Food", unit: "Singular" }).save();
  await new Ingredient({name: "Flour", type: "Food", unit: "Lbs"}).save();
  await new Ingredient({ name: "Sugar", type: "Food", unit: "Lbs" }).save();
  await new Ingredient({ name: "Coconut Shredded", type: "Food", unit: "Lbs" }).save();

 
  const Purchaseorder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
  
  let purchaseorder = new Purchaseorder();
  purchaseorder.poNumber = "HA0001";
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: "Eggs" }), quantity: 5 });
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: "Flour" }), quantity: 10 });
  purchaseorder.supplier = { name: "heime", address: "123456" };
  await purchaseorder.save();

  purchaseorder = new Purchaseorder();
  purchaseorder.poNumber = "HA0002";
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: "Eggs" }), quantity: 5 });
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: "Flour" }), quantity: 10 });
  purchaseorder.supplier = { name: "heime", address: "123456" };
  await purchaseorder.save();

  purchaseorder = new Purchaseorder();
  purchaseorder.poNumber = "HA0003";
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: "Eggs" }), quantity: 5 });
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: "Flour" }), quantity: 10 });
  purchaseorder.ingredients.push({
    ingredient: await Ingredient.findOne({ name: "Coconut Shredded" }),
    quantity: 10
  });

  purchaseorder.supplier = { name: "heime", address: "123456" };

  await purchaseorder.save();

  

   let foo = await Purchaseorder.findOne({poNumber : "HA0003"}).populate('ingredients.ingredient');
   for (i of foo.ingredients) {
     console.log(`quantity: ${i.quantity} ingredient name: ${i.ingredient.name}`);
   }
}

run().catch(error => {console.error(error.stack)});