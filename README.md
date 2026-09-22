# sw2026 — E-commerce REST API

## Description
A REST API for a simple e-commerce platform, built with Node.js and Express.
It supports user registration and login (JWT-based authentication) and a
checkout flow that accepts cash or credit card as payment methods. Cash
payments receive a 10% discount. All data (users and products) is kept
in memory — there is no database.

## Installation
Requirements: Node.js 18+ and npm.

```bash
npm install
```

Optionally copy `.env.example` to `.env` to customize the port, JWT secret,
and token expiration:

```bash
cp .env.example .env
```

## How to Run
```bash
npm start
```

The API will be available at `http://localhost:3000/api` (or the port set in
`.env`). Interactive Swagger documentation is served at:

```
http://localhost:3000/api/docs
```

## Rules
- The checkout accepts only `cash` or `credit_card` as payment methods.
- Paying with `cash` applies a 10% discount to the order subtotal.
- Only authenticated users (valid JWT token) can perform a checkout.

## Existent Data
### Users (password for all seeded users: `Password123!`)
| id | name          | email               |
|----|---------------|---------------------|
| 1  | Alice Johnson | alice@example.com   |
| 2  | Bob Smith     | bob@example.com     |
| 3  | Carol Davis   | carol@example.com   |

### Products
| id | name                | price  | stock |
|----|---------------------|--------|-------|
| 1  | Wireless Mouse      | 25.99  | 100   |
| 2  | Mechanical Keyboard | 79.99  | 50    |
| 3  | USB-C Hub           | 34.50  | 75    |

## How to Use the REST API
Base URL: `http://localhost:3000/api`

### 1. Health check
```bash
curl http://localhost:3000/api/healthcheck
```

### 2. Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"MyPassword123!"}'
```

### 3. Login to get a JWT token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Password123!"}'
```
Response contains a `token` field. Use it as a Bearer token for the checkout
endpoint.

### 4. Checkout (requires authentication)
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
        "items": [{ "productId": 1, "quantity": 2 }],
        "paymentMethod": "cash"
      }'
```

### API Documentation
Full request/response schemas are available via the Swagger UI at
`GET /api/docs`, generated from the [swagger.yaml](swagger.yaml) file in the
project root.

## Project Structure
```
src/
  controllers/   # Request handlers
  middleware/    # Auth and error-handling middleware
  models/        # In-memory data (users, products)
  routes/        # Express route definitions
  services/      # Business logic (auth, checkout)
  app.js         # Express app configuration
  server.js      # Application entry point
swagger.yaml     # OpenAPI/Swagger specification
```

## Test Coverage
Functional path-coverage tests live under `test/pathCoverage` and are built
with Mocha, Chai, and Supertest, running against a real, locally spawned
instance of the API over HTTP. Run them with:

```bash
npm test
```

A Mochawesome HTML/JSON report is generated at
`test/pathCoverage/report/path-coverage-report.html`.

## CI/CD
A GitHub Actions workflow ([.github/workflows/api-tests.yml](.github/workflows/api-tests.yml))
runs the test suite on every pull request to `main`. It installs
dependencies, starts the API in the background, waits for `/api/healthcheck`
to respond, then runs `npm test`.

| Test file | Test name | Summary |
|-----------|-----------|---------|
| `healthcheck.test.js` | returns API health status | Calls `GET /healthcheck` and verifies a `200` response with `status`, `uptime`, and `timestamp` fields. |
| `auth.register.test.js` | registers a new user with valid data | Calls `POST /auth/register` with a unique email and verifies a `201` response containing the created user's `name`, `email`, and `id`. |
| `auth.login.test.js` | logs in a seeded user and returns a JWT token | Calls `POST /auth/login` with a seeded user's credentials (Alice) and verifies a `200` response with a non-empty JWT `token`. |
| `checkout.test.js` | EP-DISC-01: applies a 10% discount when paymentMethod is cash | Logs in, then checks out with `paymentMethod: "cash"` and verifies the 10% discount is reflected in `subtotal`, `discount`, and `total`. |
| `checkout.test.js` | EP-DISC-02: applies no discount when paymentMethod is credit_card | Same cart as above with `paymentMethod: "credit_card"` and verifies no discount is applied. |
| `checkout.test.js` | EP-DISC-03: rejects an invalid paymentMethod | Attempts checkout with an unsupported payment method (`boleto`) and verifies a `400` response with no `order` in the body. |
