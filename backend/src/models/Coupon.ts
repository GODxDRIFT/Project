import mongoose, { Document, Schema } from "mongoose";

export interface ICoupon extends Document {
  title: string;
  code: string;
  discount: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CouponSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    discount: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICoupon>("Coupon", CouponSchema);
