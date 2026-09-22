const { expect } = require('chai');
const request = require('supertest');
const { BASE_URL } = require('./setup');

describe('Path: POST /auth/login', () => {
  it('logs in a seeded user and returns a JWT token', async () => {
    const res = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'Password123!' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token').that.is.a('string').and.not.empty;
  });
});
