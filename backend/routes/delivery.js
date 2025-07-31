import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getDeliveryOrders, updateOrderStatus } from '../controllers/orderController.js';
import { body } from 'express-validator';

const router = express.Router();

// Delivery dashboard (stub)
router.get('/dashboard', authenticate('DeliveryBoy'), (req, res) => {
  res.json({ message: 'Delivery dashboard (stub)' });
});

// View assigned orders, update order status (add as needed)
// Delivery: Get assigned orders
router.get('/orders', authenticate('DeliveryBoy'), getDeliveryOrders);
// Delivery: Update order status
router.put('/order/:id/status', authenticate('DeliveryBoy'), [
  body('status').notEmpty()
], updateOrderStatus);

export default router; 