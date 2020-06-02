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

describe('Restricted ingredient routes', () => {
  let authenticatedSession;

  beforeAll(async () => {
    const testSession = session(server);
    const res = await testSession.post('/auth/signin').send({ email: 'user@example.com', password: 'abc123' });
    expect(res.status).toBe(200);
    authenticatedSession = testSession;
  });


  it('can get all the ingredients with the right number', async () => {
    const res = await authenticatedSession.get('/ingredients');
    expect(res.status).toBe(200);
    expect(res.body.content).toHaveLength(4);
  });

  it('can create a new ingredient', async () => {
    let res = await authenticatedSession.post('/ingredients').send({ name: 'Garlic', type: 'Food', unit: 'Cloves' });
    expect(res.status).toBe(200);
    res = await authenticatedSession.get('/ingredients');
    expect(res.body.content).toHaveLength(5);
  });

  it('can delete an ingredient', async () => {
    const ing = await Ingredient.where({ name: 'Garlic' }).findOne();
    // eslint-disable-next-line no-underscore-dangle
    let res = await authenticatedSession.delete(`/ingredients/${ing._id}`);
    expect(res.status).toBe(200);
    res = await authenticatedSession.get('/ingredients');
    expect(res.body.content).toHaveLength(4);
  });

  it('can update an ingredient', async () => {
    await authenticatedSession.post('/ingredients').send({ name: 'Garlic', type: 'Food', unit: 'Cloves' });
    let ing = await Ingredient.where({ name: 'Garlic' }).findOne();
    // eslint-disable-next-line no-underscore-dangle
    await authenticatedSession.put(`/ingredients/${ing._id}`).send({ name: 'Garlic', type: 'Food', unit: 'Ounces' });
    ing = await Ingredient.where({ name: 'Garlic' }).findOne();
    expect(ing.unit).toBe('Ounces');
  });
});
