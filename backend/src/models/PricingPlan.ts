import mongoose from 'mongoose';

const pricingPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  values: [{ type: String }],
  features: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('PricingPlan', pricingPlanSchema);
