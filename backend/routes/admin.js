import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant } from '../controllers/restaurantController.js';
import { getAllOrders, deleteOrder } from '../controllers/orderController.js';
import { body } from 'express-validator';

const router = express.Router();

// Admin dashboard (stub)
router.get('/dashboard', authenticate('Admin'), (req, res) => {
  res.json({ message: 'Admin dashboard (stub)' });
});

// Manage users, restaurants, orders (add CRUD as needed)
// User management (Admin only)
router.get('/users', authenticate('Admin'), getAllUsers);
router.get('/users/:id', authenticate('Admin'), getUserById);
router.put('/users/:id', authenticate('Admin'), [
  body('name').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('role').optional().isIn(['Customer', 'Admin', 'Restaurant', 'DeliveryBoy'])
], updateUser);
router.delete('/users/:id', authenticate('Admin'), deleteUser);

// Restaurant management (Admin only)
router.post('/restaurants', authenticate('Admin'), [
  body('name').notEmpty(),
  body('address').notEmpty()
], createRestaurant);
router.get('/restaurants', authenticate('Admin'), getAllRestaurants);
router.get('/restaurants/:id', authenticate('Admin'), getRestaurantById);
router.put('/restaurants/:id', authenticate('Admin'), [
  body('name').optional().notEmpty(),
  body('address').optional().notEmpty()
], updateRestaurant);
router.delete('/restaurants/:id', authenticate('Admin'), deleteRestaurant);

// Admin: Get all orders
router.get('/orders', authenticate('Admin'), getAllOrders);
// Admin: Delete order
router.delete('/orders/:id', authenticate('Admin'), deleteOrder);

export default router; 