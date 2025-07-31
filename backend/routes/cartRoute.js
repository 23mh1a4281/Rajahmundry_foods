import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post("/get",authenticate('Customer'),getCart);
cartRouter.post("/add",authenticate('Customer'),addToCart);
cartRouter.post("/remove",authenticate('Customer'),removeFromCart);

export default cartRouter;