import { Request, Response } from "express";
import Enquiry from "../../models/enquiryModel";
import { Membership } from "../../models/membershipModel";
import BusinessListing from "../../models/BusinessListing";
import UserEnquiryForVendor from "../../models/UserEnquiryForVendor";

// GET all enquiries
export const getAllEnquiries = async (req: Request, res: Response) => {
  try {
    const enquiries = await Enquiry.find().populate('user').sort({ _id: -1 });
    console.log(enquiries)
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enquiries" });
  }
};

// POST create a new enquiry
export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const { user, phone, name, requirement, category } = req.body;
    console.log("BODY:-", req.body)
    const newEnquiry = new Enquiry({ user, phone, name, requirement, category });
    await newEnquiry.save();
    res.status(201).json({ status: true, data: newEnquiry, message: "Enquiry created successfully" });
  } catch (error) {
    console.log("error:-", error)
    res.status(500).json({ message: "Failed to create enquiry" });
  }
};

// export const sendUserEnquiryForVendor = async (req: Request, res: Response) => {
//   try {
//     const enquiryId = req.params.id;
//     const { category, action } = req.body;

//     if (!Array.isArray(category) || !action) {
//       return res.status(400).json({ message: "Missing category or action" });
//     }

//     // Step 1: Check if enquiry exists
//     const enquiryData = await Enquiry.findById(enquiryId);
//     if (!enquiryData) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }

//     // Step 2: Fetch membership users
//     const plans = await Membership.find({
//       "planDetails.name": { $regex: new RegExp(`^${action}$`, "i") },
//     });

//     const planUserIds = plans.map((plan) => String(plan.user));



//     // Step 3: Get all listings matching the categories
//     const listings = await BusinessListing.find({
//       "businessCategory.categoryName": {
//         $in: category.map((cat: string) => new RegExp(`^${cat}$`, "i")),
//       },
//     });

//     // console.log("planUserIds=>>", planUserIds, plans, listings)
//     // Step 4: Filter by membership plan (if exists)
//   // const planUserIds = plans.map((plan) => String(plan.user));

// console.log("Plan User IDs:", planUserIds);

// // Filter listings where contactPerson.userId matches a plan user
// const matchedListings = plans.length > 0
//   ? listings.filter((listing) => {
//       const listingUserId = String(listing?.contactPerson?.userId || "");
//       const isMatch = planUserIds.includes(listingUserId);

//       console.log(
//         `Checking listing userId: ${listingUserId} => Match: ${isMatch}`
//       );

//       return isMatch;
//     })
//   : listings;

// // console.log("Matched Listings:", matchedListings);
//     console.log("planUserIds=>>", planUserIds, plans, listings, matchedListings)

//     // Step 5: Create enquiry entries
//     const savedEntries = [];

//     for (const listing of matchedListings) {
//       const userId = listing?.contactPerson?.userId;
//       const businessName = listing?.businessDetails?.businessName;

//       if (!userId || !businessName) continue;

//       const alreadyExists = await UserEnquiryForVendor.findOne({
//         enquiryId,
//         userId,
//         BussinesName: businessName,
//       });

//       if (!alreadyExists) {
//         const newEntry = new UserEnquiryForVendor({
//           enquiryId,
//           userId,
//           BussinesName: businessName,
//           status: "Pending",
//         });
//         await newEntry.save();
//         savedEntries.push(newEntry);
//       }
//     }

//     return res.status(200).json({
//       message: `${savedEntries.length} enquiry(s) sent to vendors`,
//       entries: savedEntries,
//     });

//   } catch (error) {
//     console.error("sendUserEnquiryForVendor error:", error);
//     return res.status(500).json({ message: "Failed to process enquiry", error });
//   }
// };

export const sendUserEnquiryForVendor = async (req: Request, res: Response) => {
  try {
    const enquiryId = req.params.id;
    const { category, action } = req.body;

    // Step 1: Input validation
    if (!Array.isArray(category) || category.length === 0 || category.some((c) => !c || typeof c !== "string")) {
      return res.status(200).json({ message: "Missing or invalid category.", status: false, });
    }

    if (!action || typeof action !== "string" || !action.trim()) {
      return res.status(200).json({ message: "Missing or invalid action.", status: false, });
    }

    console.log("category, action =>", category, action);

    // Step 2: Ensure enquiry exists
    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(204).json({ message: "Enquiry not found.", status: false });
    }

    // Step 3: Fetch membership users matching the plan
    const matchedPlans = await Membership.find({ "planDetails.name": { $regex: new RegExp(`^${action}$`, "i") }, });

    // const matchedPlans1 = await Membership.find({ "planDetails.name": { $regex: new RegExp(`^${action==}$`, "i") }, });

    const planUserIdSet = matchedPlans.map((plan) => plan?.businessId);

    // Step 4: Fetch business listings for provided categories
    const listings = await BusinessListing.find({ "businessCategory.categoryName": { $in: category?.map((cat: any) => new RegExp(`^${cat}$`, "i")), }, });
    // console.log("Plan User IDs:==>", listings, planUserIdSet?.length)
    // Step 5: Filter listings by users who have valid memberships (if any plans found)

    const matchedListings = planUserIdSet.length > 0 ? listings.filter((listing) => planUserIdSet.map((planUserId) => listing?._id === planUserId)) : listings.filter((listing) => planUserIdSet.map((planUserId) => listing?._id !== planUserId));

    // Step 6: Create unique user enquiry records
    const savedEntries = [];
    // console.log("matchedListings:=>", matchedListings)
    for (const listing of matchedListings) {
      const userId = listing?.contactPerson?.userId;
      const businessName = listing?.businessDetails?.businessName;

      if (!userId || !businessName) continue;

      const exists = await UserEnquiryForVendor.findOne({
        enquiryId,
        userId,
        BussinesName: businessName,
        planSentTo: action,
      });

      if (!exists) {
        const entry = new UserEnquiryForVendor({
          enquiryId,
          userId,
          BussinesName: businessName,
          planSentTo: action,
        });
        await entry.save();
        savedEntries.push(entry);
      }
    }

    console.log("savedEntries:=>", savedEntries)

    if (savedEntries.length > 0) {
      // 1. Convert any string `planSentTo` fields into arrays (one-time fix)
      await Enquiry.updateMany(
        { planSentTo: { $type: "string" } },
        [
          {
            $set: {
              planSentTo: {
                $cond: {
                  if: { $isArray: "$planSentTo" },
                  then: "$planSentTo",
                  else: ["$planSentTo"]
                }
              }
            }
          }
        ]
      );

      // 2. Add `action` to the `planSentTo` array if not already present
      await Enquiry.findByIdAndUpdate(enquiryId, {
        $addToSet: { planSentTo: action }, // action is like "Free" or "Premium"
      });
    }

    if (savedEntries?.length > 0) {
      return res.status(200).json({
        message: `${savedEntries?.length} enquiry(s) sent to matched vendors.`,
        entries: savedEntries,
        status: true
      });
    }

    res.status(200).json({ message: "No matching vendors found.", status: false });

  } catch (error) {
    console.error("sendUserEnquiryForVendor error:", error);
    return res.status(500).json({
      message: "Failed to process enquiry.",
      error: error instanceof Error ? error.message : error,
      status: false
    });
  }
};

export const getAllUserEnquiriesForVendor = async (req: Request, res: Response) => {
  try {
    const user = req.params.id
    const enquiries = await UserEnquiryForVendor.find({ userId: user }).populate('enquiryId').populate('enquiryId.user').populate('userId').sort({ _id: -1 });
    res.status(200).json({ status: true, data: enquiries });
  } catch (error) {
    console.error("getAllUserEnquiriesForVendor error:", error);
    return res.status(500).json({ status: false, message: "Failed to fetch enquiries", error });
  }
}