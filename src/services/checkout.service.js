const productModel = require('../models/product.model');

const VALID_PAYMENT_METHODS = ['cash', 'credit_card'];
const CASH_DISCOUNT_RATE = 0.1;

class CheckoutError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function checkout({ items, paymentMethod }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new CheckoutError('items must be a non-empty array', 400);
  }

  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    throw new CheckoutError(
      `paymentMethod must be one of: ${VALID_PAYMENT_METHODS.join(', ')}`,
      400
    );
  }

  const orderItems = items.map(({ productId, quantity }) => {
    if (!productId || !quantity || quantity <= 0) {
      throw new CheckoutError('Each item requires a valid productId and quantity > 0', 400);
    }

    const product = productModel.findById(productId);
    if (!product) {
      throw new CheckoutError(`Product with id ${productId} not found`, 404);
    }

    if (product.stock < quantity) {
      throw new CheckoutError(`Insufficient stock for product ${product.name}`, 409);
    }

    const subtotal = product.price * quantity;
    return {
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity,
      subtotal,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = paymentMethod === 'cash' ? subtotal * CASH_DISCOUNT_RATE : 0;
  const total = subtotal - discount;

  return {
    items: orderItems,
    paymentMethod,
    subtotal: round(subtotal),
    discount: round(discount),
    total: round(total),
  };
}

function round(value) {
  return Math.round(value * 100) / 100;
}

module.exports = {
  CheckoutError,
  checkout,
};
