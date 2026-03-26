import express from "express";
import {
    createPlan,
    getAllPlans,
    //   getPlanById,
      updatePlan,
    //   deletePlan
} from "../../controllers/admin/pricingPlanController";

const router = express.Router();

// @route   POST /api/plans/create
router.post("/create", createPlan);

// // @route   GET /api/plans/all
router.get("/get-all-plan", getAllPlans);

// // @route   GET /api/plans/:id
// router.get("/:id", getPlanById);

// // @route   PUT /api/plans/update/:id
router.post("/update-plan/:id", updatePlan);

// // @route   DELETE /api/plans/delete/:id
// router.delete("/delete/:id", deletePlan);

export default router;
