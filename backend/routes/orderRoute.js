import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getAllOrders, placeOrder, updateOrderStatus, getCustomerOrders, deleteOrder } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get("/list",authenticate('Admin'),getAllOrders);
orderRouter.post("/userorders",authenticate('Customer'),getCustomerOrders);
orderRouter.post("/place",authenticate('Customer'),placeOrder);
orderRouter.put("/status/:id",authenticate(['Restaurant','DeliveryBoy']),updateOrderStatus);
orderRouter.delete("/:id",authenticate('Admin'),deleteOrder);

export default orderRouter;