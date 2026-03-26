import PinCode from "../../models/PinCodeModel"; // Adjust path as needed
import State from "../../models/StateModel";
import { Request, Response } from "express";


export const createPincodeByExcel = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ status: false, message: "Input data must be a non-empty array.", });
        }

        // 1. Normalize incoming data
        const normalizedData = data.map((item: any) => ({
            state: String(item["State"] || "").trim(),
            area: String(item["Area Name"] || "").trim(),
            pinCode: String(item["pinCode"] || "").trim(),
        }));

        // 2. Load all states once
        const states = await State.find({});
        const stateSet = new Set(states.map((s) => s.name.toLowerCase()));

        // 3. Find existing pincodes in DB once
        const allPinCodes = await PinCode.find(
            {},
            { stateName: 1, area: 1, pinCode: 1 }
        );

        const existingSet = new Set(
            allPinCodes.map(
                (p) =>
                    `${p.stateName.toLowerCase()}|${p.area.toLowerCase()}|${p.pinCode}`
            )
        );

        const created: any[] = [];
        const duplicates: any[] = [];
        const invalid: any[] = [];

        // 4. Process in-memory
        for (const item of normalizedData) {
            const { state, area, pinCode } = item;

            if (!state || !area || !pinCode) {
                invalid.push({ ...item, reason: "Missing required fields" });
                continue;
            }

            if (!stateSet.has(state.toLowerCase())) {
                invalid.push({ ...item, reason: "State does not exist" });
                continue;
            }

            const key = `${state.toLowerCase()}|${area.toLowerCase()}|${pinCode}`;
            if (existingSet.has(key)) {
                duplicates.push({ ...item, reason: "Already exists" });
                continue;
            }

            // Mark it as to be created
            existingSet.add(key);
            created.push({
                stateName: state,
                area,
                pinCode,
            });
        }

        // 5. Bulk insert for performance
        if (created.length > 0) {
            await PinCode.insertMany(created, { ordered: false });
        }

        return res.status(200).json({
            status: true,
            message: "Pin codes processed",
            createdCount: created.length,
            duplicateCount: duplicates.length,
            invalidCount: invalid.length,
            created: created.slice(0, 5), // send preview, not full 17k data
            duplicates: duplicates.slice(0, 5),
            invalid: invalid.slice(0, 5),
        });
    } catch (err) {
        console.error("Error uploading pin codes:", err);
        return res.status(500).json({ status: false, message: "Server error while uploading pin codes", });
    }
};


export const getAllPinCodes = async (req: Request, res: Response) => {
    try {

        const pinCodes = await PinCode.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ status: true, message: "Pin codes fetched successfully", pinCodes, });
    } catch (err) {
        console.error("Error fetching pin codes:", err);
        return res.status(500).json({ status: false, message: "Server error while fetching pin codes", });
    }
};

// export const getAllPinCodesWithPagination = async (req: Request, res: Response) => {
//     try {
//         const page = parseInt(req.query.page as string, 10) || 1;
//         const limit = parseInt(req.query.limit as string, 10) || 10;
//         const skip = (page - 1) * limit;

//         // Get paginated pin codes
//         const pinCodes = await PinCode.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);

//         // Get total count for pagination info
//         const totalCount = await PinCode.countDocuments();

//         return res.status(200).json({
//             status: true,
//             message: "Pin codes fetched successfully",
//             pinCodes,
//             pagination: {
//                 total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit),
//             },
//         });
//     } catch (err) {
//         console.error("Error fetching pin codes:", err);
//         return res.status(500).json({ status: false, message: "Server error while fetching pin codes", });
//     }
// };


export const getAllPinCodesWithPagination = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const search = (req.query.search as string)?.trim() || "";
        const skip = (page - 1) * limit;

        let query: any = {};

        if (search) {
            query = {
                $or: [
                    { stateName: { $regex: search, $options: "i" } },
                    { area: { $regex: search, $options: "i" } },
                    { pinCode: { $regex: search, $options: "i" } }, // ✅ fixed: keep search as string
                ],
            };
        }

        // Fetch paginated pin codes
        const pinCodes = await PinCode.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Count total records for pagination
        const totalCount = await PinCode.countDocuments(query);

        return res.status(200).json({
            status: true,
            message: "Pin codes fetched successfully",
            pinCodes,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (err) {
        console.error("Error fetching pin codes:", err);
        return res.status(500).json({
            status: false,
            message: "Server error while fetching pin codes",
        });
    }
};

export const createPincode = async (req: Request, res: Response) => {
    try {
        const { stateName, area, pinCode } = req.body;

        // Validate required fields
        if (!stateName || !area || !pinCode) {
            return res.status(400).json({ status: false, message: "stateName, area, and pinCode are required." });
        }

        // Validate pinCode format: exactly 6 digits
        const pinCodeRegex = /^\d{6}$/;
        if (!pinCodeRegex.test(String(pinCode).trim())) {
            return res.status(400).json({ status: false, message: "Invalid pin code. It must be exactly 6 digits." });
        }

        // Check for duplicate
        const existing = await PinCode.findOne({
            stateName: stateName.trim(),
            area: area.trim(),
            pinCode: String(pinCode).trim()
        });
        if (existing) {
            return res.status(409).json({ status: false, message: "This pin code already exists for the given state and area." });
        }

        const newPin = await PinCode.create({
            stateName: stateName.trim(),
            area: area.trim(),
            pinCode: String(pinCode).trim()
        });
        return res.status(200).json({ status: true, message: "Pin code created successfully", data: newPin });
    } catch (err) {
        console.error("Error creating pin code:", err);
        return res.status(500).json({ status: false, message: "Server error while creating pin code" });
    }
}

export const getAllPinCodesById = async (req: Request, res: Response) => {
    try {
        const pinCodes = await PinCode.findById(req.params.id).sort({ createdAt: -1 });
        return res.status(200).json({ status: true, message: "Pin codes fetched successfully", pinCodes, });
    } catch (err) {
        console.error("Error fetching pin codes:", err);
        return res.status(500).json({ status: false, message: "Server error while fetching pin codes", });
    }
}

export const updatePincode = async (req: Request, res: Response) => {
    try {
        const { stateName, area, pinCode, isActive } = req.body;
        const updatedPin = await PinCode.findByIdAndUpdate(req.params.id, { stateName, area, pinCode, isActive }, { new: true });
        return res.status(200).json({ status: true, message: "Pin code updated successfully", data: updatedPin, });
    } catch (err) {
        console.error("Error updating pin code:", err);
        return res.status(500).json({ status: false, message: "Server error while updating pin code", });
    }
}

export const deletePincode = async (req: Request, res: Response) => {
    try {
        const deletedPin = await PinCode.findByIdAndDelete(req.params.id);
        return res.status(200).json({ status: true, message: "Pin code deleted successfully", data: deletedPin, });
    } catch (err) {
        console.error("Error deleting pin code:", err);
        return res.status(500).json({ status: false, message: "Server error while deleting pin code", });
    }
}

export const getAreapincodeByState = async (req: Request, res: Response) => {
    try {
        const { state } = req?.body;

        if (!state || typeof state !== "string" || state.trim() === "") {
            return res.status(400).json({ status: false, message: "A valid state name is required." });
        }

        const data = await PinCode.find({
            stateName: { $regex: new RegExp(`^${state.trim()}$`, "i") },
            isActive: true
        });

        if (!data.length) {
            return res.status(404).json({ status: false, message: "No pin codes found for the given state." });
        }

        res.status(200).json({ status: true, data });
    } catch (err) {
        console.error("Error fetching area-pincode:", err);
        res.status(500).json({ status: false, message: "Server Error" });
    }
}