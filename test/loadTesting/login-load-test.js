import http from 'k6/http';
import { check } from 'k6';

const baseUrl = __ENV.BASE_URL || 'http://localhost:3000/api';

export const options = {
  stages: [
    { duration: '5s', target: 10 },
    { duration: '20s', target: 30 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const response = http.post(
    `${baseUrl}/auth/login`,
    JSON.stringify({
      email: 'alice@example.com',
      password: 'Password123!',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'Login' },
    },
  );

  check(response, {
    'returns HTTP 200': (result) => result.status === 200,
    'returns a JWT token': (result) => Boolean(result.json('token')),
  });
}