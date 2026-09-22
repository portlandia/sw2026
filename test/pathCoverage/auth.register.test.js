const { expect } = require('chai');
const request = require('supertest');
const { BASE_URL } = require('./setup');

describe('Path: POST /auth/register', () => {
  it('registers a new user with valid data', async () => {
    const uniqueEmail = `jane.doe.${Date.now()}@example.com`;

    const res = await request(BASE_URL)
      .post('/auth/register')
      .send({ name: 'Jane Doe', email: uniqueEmail, password: 'MyPassword123!' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.nested.property('user.name', 'Jane Doe');
    expect(res.body).to.have.nested.property('user.email', uniqueEmail);
    expect(res.body).to.have.nested.property('user.id');
  });
});
