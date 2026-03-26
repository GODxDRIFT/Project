import express from "express";
import {
  getAllMemberships, createMembershipOrder,
  verifyPayment, updateMembership, deleteMembership, statusMembership, getAllMembershipsByUser,
  sendEmail
} from "../../controllers/admin/membershipController";

const router = express.Router();

router.post("/create-memberships", createMembershipOrder);
router.post("/verify-payment", verifyPayment)
router.get("/get-all-memberships", getAllMemberships);
router.get("/get-all-memberships-by-user/:id", getAllMembershipsByUser);
router.put("/memberships/:id", updateMembership);
router.get("/delete-membership/:id", deleteMembership);
router.post("/status-membership/:id", statusMembership)
router.post("/sendEmail", sendEmail)

export default router;
