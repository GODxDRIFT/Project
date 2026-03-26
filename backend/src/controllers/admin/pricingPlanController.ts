// Filename: pricingPlan.controller.ts
import { Request, Response } from 'express';
import PricingPlan from '../../models/PricingPlan';

// CREATE Plan
export const createPlan = async (req: Request, res: Response) => {
  try {
    const plan = new PricingPlan(req.body);
    await plan.save();
    return res.status(201).json({ status: true, message: 'Plan created successfully', data: plan });
  } catch (err: any) {
    return res.status(500).json({ status: false, message: 'Error creating plan', error: err.message });
  }
};

// GET All Plans
export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await PricingPlan.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: true, data: plans });
  } catch (err: any) {
    return res.status(500).json({ status: false, message: 'Error fetching plans', error: err.message });
  }
};

// GET Plan By ID
export const getPlanById = async (req: Request, res: Response) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ status: false, message: 'Plan not found' });
    return res.status(200).json({ status: true, data: plan });
  } catch (err: any) {
    return res.status(500).json({ status: false, message: 'Error retrieving plan', error: err.message });
  }
};

// UPDATE Plan
export const updatePlan = async (req: Request, res: Response) => {
  try {
    const plan = await PricingPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ status: false, message: 'Plan not found' });
    return res.status(200).json({ status: true, message: 'Plan updated successfully', data: plan });
  } catch (err: any) {
    return res.status(500).json({ status: false, message: 'Error updating plan', error: err.message });
  }
};

// DELETE Plan
export const deletePlan = async (req: Request, res: Response) => {
  try {
    const plan = await PricingPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ status: false, message: 'Plan not found' });
    return res.status(200).json({ status: true, message: 'Plan deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ status: false, message: 'Error deleting plan', error: err.message });
  }
};
