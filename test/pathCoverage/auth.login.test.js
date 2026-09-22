const { expect } = require('chai');
const request = require('supertest');
const { BASE_URL } = require('./setup');

// Path coverage for POST /auth/login: authenticates a seeded user and returns a JWT.
describe('Path: POST /auth/login', () => {
  it('logs in a seeded user and returns a JWT token', async () => {
    // Seeded credentials from README.md (Alice Johnson).
    const res = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'Password123!' });

    expect(res.status).to.equal(200);
    // A non-empty token confirms the JWT was issued.
    expect(res.body).to.have.property('token').that.is.a('string').and.not.empty;
  });
});
