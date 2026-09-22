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

  it('EP-DISC-01: applies a 10% discount when paymentMethod is cash', async () => {
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

  it('EP-DISC-02: applies no discount when paymentMethod is credit_card', async () => {
    const res = await request(BASE_URL)
      .post('/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: 1, quantity: 2 }], paymentMethod: 'credit_card' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.nested.property('order.paymentMethod', 'credit_card');
    expect(res.body).to.have.nested.property('order.subtotal', 51.98);
    expect(res.body).to.have.nested.property('order.discount', 0);
    expect(res.body).to.have.nested.property('order.total', 51.98);
  });

  it('EP-DISC-03: rejects an invalid paymentMethod', async () => {
    const res = await request(BASE_URL)
      .post('/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: 1, quantity: 2 }], paymentMethod: 'boleto' });

    expect(res.status).to.equal(400);
    expect(res.body).to.not.have.property('order');
  });
});
