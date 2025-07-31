import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Order from '../models/Order.js';
import { placeOrder, getCustomerOrders, getOrderById } from '../controllers/orderController.js';
import { body } from 'express-validator';

const router = express.Router();

// Get customer profile
router.get('/profile', authenticate('Customer'), (req, res) => {
  res.json({ user: req.user });
});

// Place order
router.post('/order', authenticate('Customer'), [
  body('restaurantId').notEmpty(),
  body('items').isArray({ min: 1 })
], placeOrder);

// Get customer orders
router.get('/orders', authenticate('Customer'), getCustomerOrders);

// Get single order
router.get('/order/:id', authenticate('Customer'), getOrderById);

export default router; 