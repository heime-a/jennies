const session = require('supertest-session');
const hlp = require('../common/test-helper.js');
const User = require('../models/users');
const Ingredient = require('../models/ingredient');
const Recipe = require('../models/recipe');
const Purchaseorder = require('../models/purchaseorders');
const server = require('../server.js');


beforeAll(async () => {
  await hlp.createDB();
  const user = new User();
  user.email = 'user@example.com';
  user.password = user.generateHash('abc123');
  Promise.all([user.save(),
    new Ingredient({ name: 'Eggs', type: 'Food', unit: 'Singular' }).save(),
    new Ingredient({ name: 'Flour', type: 'Food', unit: 'Lbs' }).save(),
    new Ingredient({ name: 'Sugar', type: 'Food', unit: 'Lbs' }).save(),
    new Ingredient({ name: 'Coconut Shredded', type: 'Food', unit: 'Lbs' }).save(),
  ]);
});
afterAll(async (done) => { hlp.destroyDB(); done(); });

describe('Restricted workorder routes', () => {
  let authenticatedSession;

  beforeAll(async () => {
    const testSession = session(server);
    const res = await testSession.post('/auth/signin').send({ email: 'user@example.com', password: 'abc123' });
    expect(res.status).toBe(200);
    authenticatedSession = testSession;
    const recipe = {
      name: 'Vanilla Macaroons',
      manHours: 10,
      ingredients: [{
        ingredient: await Ingredient.findOne({ name: 'Eggs' }),
        quantity: 5,
      },
      {
        ingredient: await Ingredient.findOne({ name: 'Flour' }),
        quantity: 5,
      },
      {
        ingredient: await Ingredient.findOne({ name: 'Coconut Shredded' }),
        quantity: 10,
      }],
      expectedYield: 100,
      yieldUnits: 'Case',
    };
    await authenticatedSession.post('/recipes').send(recipe);
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
    purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Sugar' }), quantity: 200, unitCost: 1.50 });
    purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Coconut Shredded' }), quantity: 100, unitCost: 1.50 });
    purchaseorder.supplier = { name: 'heime', address: '123456' };
    await purchaseorder.save();
  });


  it('can create a workorder', async () => {
    const recipe = await Recipe.findOne({ name: 'Vanilla Macaroons' }).populate('ingredients.ingredient');
    const wo = {
      woNumber: 'wo0001',
      recipe,
      startDate: Date.now(),
      status: 'Completed',
      actualHours: 4,
      actualYield: 100,
      units: 'Case',
    };

    const res = await authenticatedSession.post('/workorders').send(wo);
    expect(res.status).toBe(200);
  });

  it('can get the workorders', async () => {
    const res = await authenticatedSession.get('/workorders');
    expect(res.status).toBe(200);
    expect(res.body.cote);
  });
});
