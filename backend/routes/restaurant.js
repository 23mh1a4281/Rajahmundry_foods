import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createRestaurant, getRestaurantById, updateRestaurant, deleteRestaurant } from '../controllers/restaurantController.js';
import { createMenu, getMenusByRestaurant, getMenuById, updateMenu, deleteMenu } from '../controllers/menuController.js';
import { getRestaurantOrders, updateOrderStatus } from '../controllers/orderController.js';
import { body } from 'express-validator';

const router = express.Router();

// Restaurant dashboard (stub)
router.get('/dashboard', authenticate('Restaurant'), (req, res) => {
  res.json({ message: 'Restaurant dashboard (stub)' });
});

// Manage menu, view orders (add CRUD as needed)

// Restaurant owner management
router.post('/', authenticate('Restaurant'), [
  body('name').notEmpty(),
  body('address').notEmpty()
], createRestaurant);
router.get('/:id', authenticate('Restaurant'), getRestaurantById);
router.put('/:id', authenticate('Restaurant'), [
  body('name').optional().notEmpty(),
  body('address').optional().notEmpty()
], updateRestaurant);
router.delete('/:id', authenticate('Restaurant'), deleteRestaurant);

// Menu management (Restaurant owner)
router.post('/menu', authenticate('Restaurant'), [
  body('restaurantId').notEmpty(),
  body('name').notEmpty(),
  body('price').isNumeric()
], createMenu);
router.get('/:restaurantId/menu', authenticate('Restaurant'), getMenusByRestaurant);
router.get('/menu/:menuId', authenticate('Restaurant'), getMenuById);
router.put('/menu/:menuId', authenticate('Restaurant'), [
  body('name').optional().notEmpty(),
  body('description').optional(),
  body('price').optional().isNumeric(),
  body('image').optional()
], updateMenu);
router.delete('/menu/:menuId', authenticate('Restaurant'), deleteMenu);

// Restaurant: Get all orders for their restaurant
router.get('/orders', authenticate('Restaurant'), getRestaurantOrders);
// Restaurant: Update order status
router.put('/order/:id/status', authenticate('Restaurant'), [
  body('status').notEmpty()
], updateOrderStatus);

export default router; 