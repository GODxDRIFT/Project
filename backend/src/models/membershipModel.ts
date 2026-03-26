// import mongoose from "mongoose";

// const historySchema = new mongoose.Schema(
//   {
//     status: { type: String },
//     date: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// const membershipSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     plan: { type: String, required: true },                  // e.g., "Premium Plan"
//     status: { type: String, required: true },                // e.g., "Active", "Inactive"
//     paymentStatus: { type: String, default: "Pending" },     // e.g., "Complete", "Pending"
//     paymentMode: { type: String },                           // e.g., "Razorpay", "UPI"
//     startDate: { type: Date },                               // e.g., "2025-02-21"
//     endDate: { type: Date },                                 // e.g., "2025-06-19"
//     history: [historySchema],                                // array of { status, date }
//   },
//   { timestamps: true }
// );

// export const Membership = mongoose.model("Membership", membershipSchema);


// models/Membership.js
import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    status: { type: String },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const membershipSchema = new mongoose.Schema(
  {
    orderUniqueId: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessListing" },
    planDetails: {
      name: String,
      price: Number,
      features: [String],
    },
    gstin: { type: String },
    duration: { type: Number, default: 1 }, // In months
    status: { type: Boolean, default: false }, // e.g., Active, Expired
    paymentStatus: { type: String, default: "Pending" }, // Complete or Pending
    paymentMethod: { type: String }, // COD or Online
    couponDiscount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    address: {
      city: String,
      state: String,
      pinCode: String,
      street: String,
    },
    history: [historySchema],
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export const Membership = mongoose.model("Membership", membershipSchema);
