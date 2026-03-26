import mongoose, { Document, Schema } from "mongoose";

export interface ICorporateForm extends Document {
  boxType: string;
  firstName: string;
  lastName: string;
  businessName: string;
  brandName: string;
  phone: string;
  email: string;
  message: string;
  userId: string;
}

const CorporateFormSchema: Schema = new Schema(
  {
    boxType: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    businessName: { type: String, required: true },
    brandName: { type: String, required: true },
    phone: { type: String, required: true, match: /^\d{10}$/ },
    email: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<ICorporateForm>("CorporateAdvertise", CorporateFormSchema);
