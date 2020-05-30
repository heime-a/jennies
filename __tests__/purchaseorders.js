
const session = require('supertest-session');
const hlp = require('../common/test-helper.js');
const User = require('../models/users');
const Ingredient = require('../models/ingredient');
const Purchaseorder = require('../models/purchaseorders');
const server = require('../server.js');

beforeAll(async () => {
  await hlp.createDB();
  const user = new User();
  user.email = 'user@example.com';
  user.password = user.generateHash('abc123');
  await user.save();
  await new Ingredient({ name: 'Eggs', type: 'Food', unit: 'Singular' }).save();
  await new Ingredient({ name: 'Flour', type: 'Food', unit: 'Lbs' }).save();
  await new Ingredient({ name: 'Sugar', type: 'Food', unit: 'Lbs' }).save();
  await new Ingredient({ name: 'Coconut Shredded', type: 'Food', unit: 'Lbs' }).save();

  let purchaseorder = new Purchaseorder();
  purchaseorder.poNumber = 'HA0001';
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Eggs' }), quantity: 5, unitCost: 29.95 });
  purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Flour' }), quantity: 10, unitCost: 1.99 });
  // purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Sugar' }), quantity: 5, unitCost: 1.00 });

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
  await purchaseorder.save();
});

describe('Restricted ingredient routes', () => {
  let authenticatedSession;

  beforeAll(async () => {
    const testSession = session(server);
    const res = await testSession.post('/auth/signin').send({ email: 'user@example.com', password: 'abc123' });
    expect(res.status).toBe(200);
    authenticatedSession = testSession;
  });

  it('can post a new purchase order', async () => {
    const purchaseorder = new Purchaseorder();
    purchaseorder.poNumber = 'HA0004';
    purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Eggs' }), quantity: 5, unitCost: 23.00 });
    purchaseorder.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Flour' }), quantity: 10, unitCost: 1.90 });
    purchaseorder.ingredients.push({
      ingredient: await Ingredient.findOne({ name: 'Coconut Shredded' }),
      quantity: 10,
      unitCost: 5.99,
    });
    const res = await authenticatedSession.post('/purchaseorders').send(purchaseorder);
    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  it('can get all the purchase orders', async () => {
    const res = await authenticatedSession.get('/purchaseorders');
    expect(res.status).toBe(200);
    expect(res.body.content).toHaveLength(4);
  });

  it('can update a purchase order and have correct inventory', async () => {
    const po = await Purchaseorder.where('{ poNumber: "HA0001" }').findOne().populate('ingredients.ingredient');
    po.ingredients.push({ ingredient: await Ingredient.findOne({ name: 'Sugar' }), quantity: 5, unitCost: 1.00 });
    const res = await authenticatedSession.put(`/purchaseorders/${po._id}`).send({ poNumber: po.poNumber, ingredients: po.ingredients, supplier: po.supplier });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const res1 = await authenticatedSession.get('/inventory');
    expect(JSON.stringify(res1.body.content)).toContain('Sugar');
  });
});
