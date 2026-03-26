import express from "express";
import { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, getCouponByCode, } from "../../controllers/admin/couponController";

const router = express.Router();

router.post("/create-coupon", createCoupon);
router.get("/get-all-coupon", getAllCoupons);
router.post("/update-coupon/:id", updateCoupon);
router.get("/delete-coupon/:id", deleteCoupon);

router.post("/get-coupon-by-code", getCouponByCode);

export default router;
