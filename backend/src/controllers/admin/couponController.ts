import { Request, Response } from "express";
import Coupon from "../../models/Coupon";

// Create coupon
export const createCoupon = async (req: Request, res: Response) => {
    try {
        const { title, code, discount } = req.body;

        if (!title || !code || !discount) {
            return res.status(400).json({ status: false, message: "All fields are required." });
        }

        const existing = await Coupon.findOne({ code });
        if (existing) {
            return res.status(400).json({ status: false, message: "Coupon code already exists." });
        }

        const newCoupon = await Coupon.create({ title, code, discount });
        res.status(201).json({ status: true, data: newCoupon });
    } catch (error: any) {
        res.status(500).json({ message: "Error creating coupon", error: error.message });
    }
};

// Get all coupons
export const getAllCoupons = async (_: Request, res: Response) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({ status: true, data: coupons });
    } catch (error: any) {
        res.status(500).json({ status: false, message: "Error fetching coupons", error: error.message });
    }
};

// Update coupon
export const updateCoupon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, code, discount } = req.body;

        const updated = await Coupon.findByIdAndUpdate(
            id,
            { title, code, discount },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ status: false, message: "Coupon not found." });
        }

        res.status(200).json({ status: true, data: updated });
    } catch (error: any) {
        res.status(500).json({ status: false, message: "Error updating coupon", error: error.message });
    }
}
// Delete coupon
export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Coupon.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ status: false, message: "Coupon not found." });
        }

        res.status(200).json({ status: true, message: "Coupon deleted successfully." });
    } catch (error: any) {
        res.status(500).json({ status: false, message: "Error deleting coupon", error: error.message });
    }
};

export const getCouponByCode = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(200).json({ status: false, message: "Coupon code is required." });
        }

        const coupon = await Coupon.findOne({
            code: { $regex: new RegExp(`^${code}$`, "i") }
        });

        if (!coupon) {
            return res.status(204).json({ status: false, message: "Coupon not found." });
        }

        res.status(200).json({ status: true, data: coupon });
    } catch (error: any) {
        res.status(500).json({ status: false, message: "Error fetching coupon", error: error.message });
    }
};

