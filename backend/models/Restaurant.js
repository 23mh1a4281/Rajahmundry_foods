import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
}, { timestamps: true });

export default mongoose.model('Restaurant', restaurantSchema); 