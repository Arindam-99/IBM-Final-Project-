import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  deliveryTime: { type: String, required: true },
  cuisine: { type: String, required: true },
  badge: { type: String, default: "" },
  discount: { type: String, default: "" },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { minimize: false });

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);

export default restaurantModel;
