import mongoose from "mongoose";

const userEnquiryForVendorSchema = new mongoose.Schema({
    enquiryId: { type: mongoose.Schema.Types.ObjectId, ref: "Enquiry", },
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auth", }],
    BussinesName: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const UserEnquiryForVendor = mongoose.models.UserEnquiryForVendor || mongoose.model("UserEnquiryForVendor", userEnquiryForVendorSchema);

export default UserEnquiryForVendor;
