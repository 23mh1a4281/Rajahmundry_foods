import Restaurant from '../models/Restaurant.js';
import { validationResult } from 'express-validator';

// Create restaurant (Admin or Restaurant)
export const createRestaurant = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, address } = req.body;
    const owner = req.user.id;
    const restaurant = new Restaurant({ name, address, owner });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('owner', 'name email role');
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email role');
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update restaurant
export const updateRestaurant = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, address } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    // Only owner or admin can update
    if (req.user.role !== 'Admin' && restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (name) restaurant.name = name;
    if (address) restaurant.address = address;
    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    // Only owner or admin can delete
    if (req.user.role !== 'Admin' && restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await restaurant.deleteOne();
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 