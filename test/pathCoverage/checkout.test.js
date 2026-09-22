const { expect } = require('chai');
const request = require('supertest');
const { BASE_URL } = require('./setup');

describe('Path: POST /checkout', () => {
  let token;

  before(async () => {
    const loginRes = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'Password123!' });
    token = loginRes.body.token;
  });

  it('performs a checkout for an authenticated user', async () => {
    const res = await request(BASE_URL)
      .post('/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: 1, quantity: 2 }], paymentMethod: 'cash' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.nested.property('order.paymentMethod', 'cash');
    expect(res.body).to.have.nested.property('order.subtotal', 51.98);
    expect(res.body).to.have.nested.property('order.discount', 5.2);
    expect(res.body).to.have.nested.property('order.total', 46.78);
  });
});
