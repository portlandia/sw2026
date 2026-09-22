const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

class AuthError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new AuthError('name, email and password are required', 400);
  }

  if (userModel.findByEmail(email)) {
    throw new AuthError('A user with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  const user = userModel.create({ name, email, password: hashedPassword });

  return { id: user.id, name: user.name, email: user.email };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new AuthError('email and password are required', 400);
  }

  const user = userModel.findByEmail(email);
  if (!user) {
    throw new AuthError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AuthError('Invalid credentials', 401);
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token };
}

module.exports = {
  AuthError,
  register,
  login,
};
