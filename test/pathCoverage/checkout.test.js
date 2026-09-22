const { expect } = require('chai');
const request = require('supertest');
const { BASE_URL } = require('./setup');

// Path coverage for POST /checkout, exercised with equivalence partitions (EP)
// over the paymentMethod field: cash (discount), credit_card (no discount),
// and an invalid method (rejected).
describe('Path: POST /checkout', () => {
  let token;

  before(async () => {
    // Checkout requires authentication, so obtain a JWT once for all cases.
    const loginRes = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'Password123!' });
    token = loginRes.body.token;
  });

  it('EP-DISC-01: applies a 10% discount when paymentMethod is cash', async () => {
    // 2 x Wireless Mouse (25.99) = 51.98 subtotal; cash gives a 10% discount.
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
    // Same cart as the cash case, but credit_card gets no discount applied.
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
    // 'boleto' is outside the accepted cash/credit_card partition.
    const res = await request(BASE_URL)
      .post('/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: 1, quantity: 2 }], paymentMethod: 'boleto' });

    expect(res.status).to.equal(400);
    expect(res.body).to.not.have.property('order');
  });
});
