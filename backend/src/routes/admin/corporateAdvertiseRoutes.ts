import express from "express";
import {
  createCorporate,
  getAllCorporates,
  getCorporateById,
  updateCorporate,
  deleteCorporate,
} from "../../controllers/admin/corporateController";

const router = express.Router();

router.post("/create-corporateAdvertise", createCorporate);
router.get("/get-all-corporates", getAllCorporates);
router.get("/:id", getCorporateById);
router.put("/:id", updateCorporate);
router.delete("/:id", deleteCorporate);

export default router;
