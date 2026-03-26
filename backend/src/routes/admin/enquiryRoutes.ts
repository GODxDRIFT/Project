import express from "express";
import { getAllEnquiries, createEnquiry, sendUserEnquiryForVendor ,getAllUserEnquiriesForVendor } from "../../controllers/admin/enquiryController";

const router = express.Router();

router.get("/", getAllEnquiries);
router.post("/create-enquiryform", createEnquiry);

router.post("/send-user-enquiry-for-vendor/:id", sendUserEnquiryForVendor)
router.get("/get-all-enquiries-by-user/:id", getAllUserEnquiriesForVendor);
export default router;
