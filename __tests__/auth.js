const hlp = require('../common/test-helper.js');
const User = require('../models/users');
const supertest = require('supertest');
const server = require('../server.js');
const request = supertest(server);
const session = require('supertest-session')

beforeAll(async (done) => {
    await hlp.createDB();
    const user = new User();
    user.email = 'user@example.com';
    user.password = user.generateHash('abc123');
    await user.save();
    done();
});
afterAll(async (done) => { await hlp.destroyDB(); done(); });

// This test fails because 1 !== 2
it('can authorize a valid user', async (done) => {


    const res = await request.post('/auth/signin').send({ email: 'user@example.com', password: 'abc123' });
    expect(res.body.success).toBeTruthy();
    done();

})
it('can deny an invalid password', async (done) => {

    const res = await request.post('/auth/signin').send({ email: 'user@example.com', password: 'abc122' });
    expect(res.body.success).toBeFalsy()
    done();

})

it('can deny an invalid user', async (done) => {

    const res = await request.post('/auth/signin').send({ email: 'userBad@example.com', password: 'abc122' });
    expect(res.body.success).toBeFalsy()
    done();
})

it('can signup a user and sign him in', async () => {
    let res = await request.post('/auth/signup').send({ email: 'newuser@example.com', password: 'abc123' });

    expect(res.body.success).toBeTruthy()
    res = await request.post('/auth/signin').send({ email: 'newuser@example.com', password: 'abc123' });
    // console.log(res.headers)
    expect(res.body.success).toBeTruthy()
})
it('cant sign up with a blank password', async () => {
    let res = await request.post('/auth/signup').send({ email: 'newuser@example.com', password: '' });
    expect(res.body.success).toBeFalsy()

})
it('cant sign up with a blank email', async () => {
    let res = await request.post('/auth/signup').send({ email: '', password: 'abc123' });
    expect(res.body.success).toBeFalsy()
})

it('should fail accessing a restricted page', async () => {
    const testSession = session(server);
    //await testSession.post('/auth/signin').send({ email: 'user@example.com', password: 'abc123' })
    const res = await testSession.get('/recipes');
    expect(res.status).toBe(401)
})

it('can access a restricted page after logging in', async () => {
    const testSession = session(server);
    await testSession.post('/auth/signin').send({ email: 'user@example.com', password: 'abc123' })
    const res = await testSession.get('/recipes');
    expect(res.status).toBe(200);
})

it('cannot access a restricted page after logging out', async () => {
    const testSession = session(server);
    await testSession.post('/auth/signin').send({ email: 'user@example.com', password: 'abc123' })
    await testSession.post('/auth/logout');
    const res = await testSession.get('/recipes');
    expect(res.status).toBe(401);

})