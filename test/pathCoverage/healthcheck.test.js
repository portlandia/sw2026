const { expect } = require('chai');
const request = require('supertest');
const { BASE_URL } = require('./setup');

describe('Path: GET /healthcheck', () => {
  it('returns API health status', async () => {
    const res = await request(BASE_URL).get('/healthcheck');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'ok');
    expect(res.body).to.have.property('uptime');
    expect(res.body).to.have.property('timestamp');
  });
});
