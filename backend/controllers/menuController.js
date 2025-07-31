import Menu from '../models/Menu.js';
import Restaurant from '../models/Restaurant.js';
import { validationResult } from 'express-validator';

// Create menu item
export const createMenu = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { restaurantId, name, description, price, image } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const menu = new Menu({ restaurant: restaurantId, name, description, price, image });
    await menu.save();
    restaurant.menus.push(menu._id);
    await restaurant.save();
    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all menus for a restaurant
export const getMenusByRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const menus = await Menu.find({ restaurant: req.params.restaurantId });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get menu by ID
export const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    const restaurant = await Restaurant.findById(menu.restaurant);
    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update menu
export const updateMenu = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    const restaurant = await Restaurant.findById(menu.restaurant);
    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { name, description, price, image } = req.body;
    if (name) menu.name = name;
    if (description) menu.description = description;
    if (price) menu.price = price;
    if (image) menu.image = image;
    await menu.save();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete menu
export const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    const restaurant = await Restaurant.findById(menu.restaurant);
    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await menu.deleteOne();
    // Remove from restaurant.menus array
    restaurant.menus = restaurant.menus.filter(id => id.toString() !== menu._id.toString());
    await restaurant.save();
    res.json({ message: 'Menu deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 