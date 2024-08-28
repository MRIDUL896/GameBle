const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

const paymentRoutes = express.Router();


paymentRoutes.post('/create-order', createOrder);
paymentRoutes.post('/verify-payment', verifyPayment);

module.exports = paymentRoutes;