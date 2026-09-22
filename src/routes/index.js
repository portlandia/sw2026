const express = require('express');
const authRoutes = require('./auth.routes');
const checkoutRoutes = require('./checkout.routes');
const healthRoutes = require('./health.routes');
const docsRoutes = require('./docs.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', checkoutRoutes);
router.use('/', healthRoutes);
router.use('/', docsRoutes);

module.exports = router;
