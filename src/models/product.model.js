// In-memory product catalog, pre-seeded with 3 products.
const products = [
  {
    id: 1,
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with USB receiver',
    price: 25.99,
    stock: 100,
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard',
    price: 79.99,
    stock: 50,
  },
  {
    id: 3,
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI and card reader',
    price: 34.5,
    stock: 75,
  },
];

function findById(id) {
  return products.find((product) => product.id === id);
}

function findAll() {
  return products;
}

module.exports = {
  products,
  findById,
  findAll,
};
