import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
}, { timestamps: true });

export default mongoose.model('Menu', menuSchema); 