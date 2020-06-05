const session = require('supertest-session');
const hlp = require('../common/test-helper.js');
const User = require('../models/users');
const Ingredient = require('../models/ingredient');
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
describe('Restricted ingredient routes', () => {
  let authenticatedSession;

  beforeAll(async () => {
    const testSession = session(server);
    const res = await testSession.post('/auth/signin').send({ email: 'user@example.com', password: 'abc123' });
    expect(res.status).toBe(200);
    authenticatedSession = testSession;
  });

  it('can post a new recipe', async () => {
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
    const res = await authenticatedSession.post('/recipes').send(recipe);
    expect(res.status).toBe(200);
  });

  it('can read all the recipes', async () => {
    const res = await authenticatedSession.get('/recipes');
    expect(res.status).toBe(200);
    expect(res.body.content).toHaveLength(1);
  });

  it('can update a recipe', async () => {
    let res = await authenticatedSession.get('/recipes');
    expect(res.status).toBe(200);
    const recipe = res.body.content[0];
    recipe.ingredients.push({
      ingredient: await Ingredient.findOne({ name: 'Coconut Shredded' }),
      quantity: 99,
    });
    // eslint-disable-next-line no-underscore-dangle
    res = await authenticatedSession.put(`/recipes/${recipe._id}`).send(recipe);
    expect(res.status).toBe(200);
  });
});
