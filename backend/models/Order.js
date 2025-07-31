import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{
    menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
    quantity: { type: Number, required: true, min: 1 },
  }],
  status: { type: String, enum: ['Placed', 'Accepted', 'Preparing', 'OutForDelivery', 'Delivered', 'Cancelled'], default: 'Placed' },
  deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema); 