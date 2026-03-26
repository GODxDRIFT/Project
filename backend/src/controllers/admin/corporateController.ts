import { Request, Response } from "express";
import CorporateAdvertise from "../../models/CorporateAdvertise";


export const createCorporate = async (req: Request, res: Response) => {
  try {
    const newEntry = await CorporateAdvertise.create(req.body);
    res.status(201).json({ status: true, data: newEntry });
  } catch (error: any) {
    res.status(400).json({ status: false, error: error.message });
  }
};

export const getAllCorporates = async (_req: Request, res: Response) => {
  try {
    const forms = await CorporateAdvertise.find().sort({ createdAt: -1 });
    res.status(200).json({ status: true, data: forms });
  } catch (error: any) {
    res.status(500).json({ status: false, error: error.message });
  }
};

export const getCorporateById = async (req: Request, res: Response) => {
  try {
    const form = await CorporateAdvertise.findById(req.params.id);
    if (!form) return res.status(404).json({ status: false, message: "Not found" });
    res.status(200).json({ status: true, data: form });
  } catch (error: any) {
    res.status(500).json({ status: false, error: error.message });
  }
};

export const updateCorporate = async (req: Request, res: Response) => {
  try {
    const updated = await CorporateAdvertise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ status: false, message: "Not found" });
    res.status(200).json({ status: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ status: false, error: error.message });
  }
};

export const deleteCorporate = async (req: Request, res: Response) => {
  try {
    const deleted = await CorporateAdvertise.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: false, message: "Not found" });
    res.status(200).json({ status: true, message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: false, error: error.message });
  }
};
