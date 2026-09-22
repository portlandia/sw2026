const checkoutService = require('../services/checkout.service');

function checkout(req, res, next) {
  try {
    const order = checkoutService.checkout(req.body);
    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkout,
};
