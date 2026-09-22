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