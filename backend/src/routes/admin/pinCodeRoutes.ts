import express from "express";
import { createPincodeByExcel, getAllPinCodes, createPincode, getAllPinCodesById, updatePincode, deletePincode, getAreapincodeByState, getAllPinCodesWithPagination } from "../../controllers/admin/pinCodeController";
import { upload } from "../../middleware/upload";

const router = express.Router();

router.post("/create-pincode-by-excel",  createPincodeByExcel)
router.get("/get-all-pin-codes", getAllPinCodes)
router.get("/get-All-PinCodesWith-Pagination", getAllPinCodesWithPagination)
router.post("/create-pincode", createPincode)
router.get("/get-all-pin-codes-by-id/:id", getAllPinCodesById)
router.post("/update-pincode/:id", updatePincode)
router.get("/delete-Pincode/:id", deletePincode)
router.post("/get-areapincode-by-state", getAreapincodeByState)
export default router;
