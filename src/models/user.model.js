const bcrypt = require('bcryptjs');

// In-memory user store, pre-seeded with 3 users.
// Password for all seeded users is "Password123!" (hashed with bcrypt).
const seededHash = bcrypt.hashSync('Password123!', 8);

const users = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: seededHash,
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: seededHash,
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol@example.com',
    password: seededHash,
  },
];

let nextId = users.length + 1;

function findByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

function findById(id) {
  return users.find((user) => user.id === id);
}

function create({ name, email, password }) {
  const user = {
    id: nextId++,
    name,
    email,
    password,
  };
  users.push(user);
  return user;
}

module.exports = {
  users,
  findByEmail,
  findById,
  create,
};
