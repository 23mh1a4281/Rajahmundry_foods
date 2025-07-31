import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';
import Menu from '../models/Menu.js';
import { validationResult } from 'express-validator';
import { emitOrderUpdate } from '../sockets/orderSocket.js';

// Customer: Place order
export const placeOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { restaurantId, items } = req.body; // items: [{menu, quantity}]
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    // Validate menu items
    for (const item of items) {
      const menu = await Menu.findById(item.menu);
      if (!menu || menu.restaurant.toString() !== restaurantId) {
        return res.status(400).json({ message: 'Invalid menu item' });
      }
    }
    const order = new Order({
      customer: req.user.id,
      restaurant: restaurantId,
      items,
      status: 'Placed',
    });
    await order.save();
    emitOrderUpdate(order);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Customer: Get all their orders
export const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).populate('restaurant').populate('items.menu');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Customer: Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('restaurant').populate('items.menu');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Restaurant: Get orders for their restaurant
export const getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.user.id);
    const orders = await Order.find({ restaurant: req.user.id }).populate('customer').populate('items.menu');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Restaurant/Delivery: Update order status
export const updateOrderStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { status, deliveryBoy } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Restaurant can update to Accepted, Preparing, OutForDelivery, Cancelled
    // DeliveryBoy can update to OutForDelivery, Delivered
    if (req.user.role === 'Restaurant' && order.restaurant.toString() === req.user.id) {
      order.status = status;
      if (deliveryBoy) order.deliveryBoy = deliveryBoy;
    } else if (req.user.role === 'DeliveryBoy' && order.deliveryBoy && order.deliveryBoy.toString() === req.user.id) {
      order.status = status;
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await order.save();
    emitOrderUpdate(order);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DeliveryBoy: Get assigned orders
export const getDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryBoy: req.user.id }).populate('restaurant').populate('items.menu');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer').populate('restaurant').populate('items.menu');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};