import { Request, Response } from "express";
import BusinessListing from "../../models/BusinessListing";
import path from "path";
import fs from "fs";
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { deleteLocalFile } from "../../utils/deleteImageFromLocalFolder";
import mongoose from "mongoose";

// export const createBusinessDetails = async (req: Request, res: Response) => {
//   try {
//     const { contactPerson, businessDetails, businessTiming, businessCategory, } = req.body;
//     console.log("CCCCCCCCCCCC=>DDD", req.body)
//     // const parsedBusinessDetails = JSON.parse(businessDetails);
//     // const userId = JSON.parse(contactPerson).userId
//     // // console.log("userId", userId)
//     // const existingBusiness = await BusinessListing.findOne({ "businessDetails.businessName": parsedBusinessDetails.businessName, "contactPerson.userId": userId });
//     // // console.log("userId", existingBusiness)
//     // if (existingBusiness) {
//     //   return res.status(200).json({ message: "Business already exists", status: false });
//     // }

//     // const files = req.files as Express.Multer.File[] | undefined;
//     // const imageUrls: string[] = [];
//     // let imageUrl: string | null = null;
//     // // console.log("ZZZZZZZZZZXXXXXXX1:--", req.files);
//     // if (files && Array.isArray(files)) {
//     //   for (const file of files) {
//     //     let imageUrl: string | null = null;
//     //     imageUrl = await uploadImage(file.path) as string;
//     //     // console.log("ZZZZZZZZZZXXXXXXX2:--", imageUrl);
//     //     imageUrls.push(imageUrl);
//     //     deleteLocalFile(file.path);
//     //   }
//     // }

//     // // console.log("ZZZZZZZZZZXXXXXXX:--", imageUrls);

//     // const parseBusinessCategory = JSON.parse(businessCategory)

//     // const listing = new BusinessListing({
//     //   contactPerson: JSON.parse(contactPerson),
//     //   businessDetails: { ...parsedBusinessDetails },
//     //   businessTiming: JSON.parse(businessTiming),
//     //   businessCategory: { ...parseBusinessCategory, businessImages: imageUrls, },
//     //   // upgradeListing: JSON.parse(upgradeListing),
//     //   clickCounts: {},
//     // });

//     // await listing.save();
//     // // console.log("DDDDDDDDFFFFFFFDDDDDDDD:::---", listing);
//     // res.status(201).json({ message: "Business listing created successfully", status: true, data: listing, });
//   } catch (error: unknown) {
//     const err = error as Error;
//     console.error("Error creating business listing:", err);
//     res.status(500).json({ message: "Failed to create business listing", status: false, error: err.message, });
//   }
// };

export const createBusinessDetails = async (req: Request, res: Response) => {
  try {
    const {
      contactPerson,
      businessDetails,
      businessTiming,
      businessCategory
    } = req.body;

    // Parse JSON fields safely
    let parsedContact, parsedDetails, parsedTiming, parsedCategory;
    console.log("GGGGGG:=>", parsedContact, parsedDetails, parsedTiming, parsedCategory)
    try {
      parsedContact = JSON.parse(contactPerson);
      parsedDetails = JSON.parse(businessDetails);
      parsedTiming = JSON.parse(businessTiming);
      parsedCategory = JSON.parse(businessCategory);
    } catch (parseError) {
      console.error("Invalid JSON in request body:", parseError);
      return res.status(400).json({
        message: "Invalid JSON format in one or more fields.",
        status: false,
      });
    }

    const userId = parsedContact?.userId;

    // Check for duplicate business listing
    const existingBusiness = await BusinessListing.findOne({
      "businessDetails.businessName": parsedDetails.businessName,
      "contactPerson.userId": userId,
    });

    if (existingBusiness) {
      return res.status(200).json({
        message: "Business already exists",
        status: false,
      });
    }

    // Handle uploaded files
    const files = req.files as Express.Multer.File[] | undefined;
    const imageUrls: string[] = [];

    if (files && Array.isArray(files)) {
      for (const file of files) {
        try {
          const uploadedUrl = await uploadImage(file.path);
          imageUrls.push(uploadedUrl as string);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
        } finally {
          deleteLocalFile(file.path); // always delete local file
        }
      }
    }

    // Create new business listing
    const newListing = new BusinessListing({
      contactPerson: parsedContact,
      businessDetails: parsedDetails,
      businessTiming: parsedTiming,
      businessCategory: {
        ...parsedCategory,
        businessImages: imageUrls,
      },
      clickCounts: {},
    });

    await newListing.save();

    res.status(201).json({
      message: "Business listing created successfully",
      status: true,
      data: newListing,
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error creating business listing:", err);
    res.status(500).json({
      message: "Failed to create business listing",
      status: false,
      error: err.message,
    });
  }
};

export const getAllListings = async (req: Request, res: Response) => {
  try {
    const listings = await BusinessListing.find()
      .sort({ createdAt: -1 })
      .populate('businessCategory.category')
      .populate('businessCategory.subCategory')
      .populate("contactPerson.userId");

    // console.log("XXXXXXXX", listings)
    res.status(200).json({ status: true, message: "Listings fetched successfully", data: listings });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Error fetching listings", error: err.message });
  }
};

export const getAllListingsById = async (req: Request, res: Response) => {
  try {
    const listing = await BusinessListing.findById(req.params.id).populate("businessCategory.category").populate("businessCategory.subCategory").populate("contactPerson.userId");;
    if (!listing) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ data: listing, status: true, message: "Listing fetched successfully" });

  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Error fetching listings", error: err.message });
  }
};

// export const updateAllListingsById = async (req: Request, res: Response) => {
//   try {
//     const listingId = req.params.id;
//     const existingListing = await BusinessListing.findById(listingId);
//     console.log("existingListing==>", req.body)
//     if (!existingListing) {
//       return res.status(404).json({ status: false, message: "Listing not found" });
//     }
//     //  const existingListing2= existingListing.filter((img)=>img)

//     const files = req.files as Express.Multer.File[] || [];
//     const {
//       contactPerson,
//       businessDetails,
//       businessCategory,
//       upgradeListing,
//       businessOldImage,
//     } = req.body;
//     // existingListing.businessCategory?.businessImages.filter((img: any) => img != oldImg))
//     // .map((oldImg: any) => oldImg)
//     let existingListing2: any = [];

//     if (Array.isArray(businessOldImage)) {
//       existingListing2 = existingListing.businessCategory?.businessImages.filter((img: any) => businessOldImage.map((oldImg: any) => img !== oldImg));
//     } else {
//       existingListing2 = existingListing?.businessCategory?.businessImages.filter((img: any) => img !== businessOldImage);
//     }
//     console.log("GGSSSS:==>", existingListing2)
//     console.log("GGSSSS:==>", existingListing?.businessCategory?.businessImages)
//     // Utility to parse stringified JSON
//     const parseIfJson = (data: any) => {
//       try {
//         return typeof data === "string" ? JSON.parse(data) : data;
//       } catch {
//         return data;
//       }
//     };

//     const parsedContact = parseIfJson(contactPerson);
//     const parsedDetails = parseIfJson(businessDetails);
//     const parsedCategory = parseIfJson(businessCategory);
//     const parsedUpgrade = parseIfJson(upgradeListing);

//     // Extract files with fieldname `businessImages`
//     const uploadedImageFiles = files.filter(file =>
//       file.fieldname.startsWith("businessImages")
//     );

//     let imageUrls: string[] = existingListing2 || [];

//     if (uploadedImageFiles.length > 0) {
//       // Delete old images before uploading new ones
//       // if (existingListing.businessCategory?.businessImages?.length > 0) {
//       //   for (const oldImage of existingListing.businessCategory.businessImages) {
//       //     await deleteImage(oldImage);
//       //   }
//       // }

//       if ((existingListing2?.length ?? 0) > 0) {
//         for (const oldImage of existingListing2) {
//           await deleteImage(oldImage);
//         }
//       }
//       // Upload new images
//       for (const file of uploadedImageFiles) {
//         const uploadedUrl = await uploadImage(file.path) as string;
//         imageUrls.push(uploadedUrl);
//         deleteLocalFile(file.path);
//       }
//       // if (Array.isArray(businessOldImage)) {
//       //  existingListing2.businessCategory?.businessImages.map((oldImg: any) => imageUrls.push(oldImg))
//       // } else {
//       //  existingListing2.businessCategory?.businessImages.map((oldImg: any) => imageUrls.push(oldImg))
//       // }

//       parsedCategory.businessImages = imageUrls;
//     } else {
//       // No new images uploaded, keep existing images
//       parsedCategory.businessImages = existingListing2 || [];
//     }

//     // Perform the update
//     const updated = await BusinessListing.findByIdAndUpdate(
//       listingId,
//       {
//         contactPerson: parsedContact,
//         businessDetails: parsedDetails,
//         businessCategory: parsedCategory,
//         upgradeListing: parsedUpgrade,
//         faq: JSON.parse(req?.body?.faq) || req?.body?.faq
//       },
//       { new: true }
//     );

//     return res.status(200).json({ status: true, message: "Listing updated successfully", data: updated, });

//   } catch (error: unknown) {
//     const err = error as Error;
//     return res.status(500).json({ status: false, message: "Error updating listing", error: err.message, });
//   }
// };


export const updateAllListingsById = async (req: Request, res: Response) => {
  try {
    const listingId = req.params.id;

    const existingListing = await BusinessListing.findById(listingId);
    if (!existingListing) {
      return res.status(404).json({ status: false, message: "Listing not found" });
    }

    const files = req.files as Express.Multer.File[] || [];
    const {
      contactPerson,
      businessDetails,
      businessCategory,
      upgradeListing,
      businessOldImage,
      faq
    } = req.body;

    const parseIfJson = (data: any) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data;
      } catch {
        return data;
      }
    };

    const parsedContact = parseIfJson(contactPerson);
    const parsedDetails = parseIfJson(businessDetails);
    const parsedCategory = parseIfJson(businessCategory);
    const parsedUpgrade = parseIfJson(upgradeListing);
    const parsedFaq = parseIfJson(faq);

    const oldImages: string[] = Array.isArray(businessOldImage)
      ? businessOldImage
      : businessOldImage ? [businessOldImage] : [];

    const existingImages = existingListing.businessCategory?.businessImages || [];

    // Keep only the old images that should be retained
    const retainedImages = existingImages.filter((img: string) => oldImages.includes(img));

    // Delete images that are not retained
    const imagesToDelete = existingImages.filter((img: string) => !oldImages.includes(img));
    for (const img of imagesToDelete) {
      await deleteImage(img);
    }

    // Upload new images
    const uploadedImageFiles = files.filter(file => file.fieldname.startsWith("businessImages"));
    const uploadedImageUrls: string[] = [];

    for (const file of uploadedImageFiles) {
      const url = await uploadImage(file.path);
      if (url) uploadedImageUrls.push(url);
      deleteLocalFile(file.path);
    }

    // Combine retained and newly uploaded images
    parsedCategory.businessImages = [...retainedImages, ...uploadedImageUrls];

    // Perform the update
    const updated = await BusinessListing.findByIdAndUpdate(
      listingId,
      {
        contactPerson: parsedContact,
        businessDetails: parsedDetails,
        businessCategory: parsedCategory,
        upgradeListing: parsedUpgrade,
        faq: parsedFaq
      },
      { new: true }
    );

    return res.status(200).json({ status: true, message: "Listing updated successfully", data: updated, });

  } catch (error: unknown) {
    console.error("Error updating listing:", error);
    const err = error as Error;
    return res.status(500).json({ status: false, message: "Error updating listing", error: err.message, });
  }
};


export const deleteBusinessListing = async (req: Request, res: Response) => {
  try {
    const listing = await BusinessListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Delete all business images if they exist
    const images: string[] = listing.businessCategory?.businessImages || [];

    images.forEach((img) => {
      const filePath = path.join(__dirname, `/uploads/${img}`);
      // console.log("HHHHHHHH", filePath)
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          deleteImage(img)
        }
      } catch (fileErr) {
        console.error("Error deleting file:", fileErr);
      }
    });

    // Delete the listing from DB
    await BusinessListing.findByIdAndDelete(req.params.id);

    res.status(200).json({ status: true, message: "Listing deleted", data: listing });

  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Error fetching listings", error: err.message });
  }
};

export const updateBusinessListingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ status: false, message: "New status is required" });
    }

    const listing = await BusinessListing.findByIdAndUpdate(req.params.id, { "businessDetails.status": status }, { new: true });

    if (!listing) {
      return res.status(404).json({ status: false, message: "Business listing not found" });
    }

    res.status(200).json({ status: true, message: "Business listing status updated successfully", data: listing, });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Error fetching listings", error: err.message });
  }
};

// export const updateBusinessListingVerified = async (req: Request, res: Response) => {
//   try {
//     const { verified } = req.body;
//     console.log("verified:=>", verified)

//     const listing = await BusinessListing.findByIdAndUpdate(req.params.id, { "verified": verified }, { new: true });

//     if (!listing) {
//       return res.status(404).json({ status: false, message: "Business listing not found" });
//     }

//     res.status(200).json({ status: true, message: "Business listing verified updated successfully", data: listing, });
//   } catch (error: unknown) {
//     const err = error as Error;
//     res.status(500).json({ message: "Error fetching listings", error: err.message });
//   }
// };

export const updateBusinessListingVerified = async (req: Request, res: Response) => {
  try {
    const { verified } = req.body;

    const listing = await BusinessListing.findByIdAndUpdate(req.params.id, { verified }, { new: true });

    if (!listing) {
      return res.status(404).json({ status: false, message: "Business listing not found", });
    }

    res.status(200).json({ status: true, message: "Business listing verification status updated successfully", data: listing, });
  } catch (error: any) {
    res.status(500).json({ status: false, message: "Error updating verification status", error: error.message, });
  }
};

export const changePublishStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ status: false, message: "New status is required" });
    }

    const listing = await BusinessListing.findByIdAndUpdate(
      req.params.id,
      { "businessDetails.publishedDate": status },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ status: false, message: "Business listing not found" });
    }

    res.status(200).json({
      status: true,
      message: "Business listing status updated successfully",
      data: listing,
    });
  } catch (err: any) {
    console.error("Error updating business listing status:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const listingBulkAction = async (req: Request, res: Response) => {
  try {
    const { ids, action } = req.body;
    // console.log("action:-", ids, action)
    if (!ids || !action) {
      return res.status(400).json({ status: false, message: "Ids and action are required" });
    }

    if (action === "Delete") {
      await BusinessListing.deleteMany({ _id: { $in: ids } });
      return res.status(200).json({ status: true, message: "Listings deleted successfully" });
    }

    if (action === "publish") {
      await BusinessListing.updateMany({ _id: { $in: ids } }, { "businessDetails.publishedDate": action });
      return res.status(200).json({ status: true, message: "Listings published successfully" });
    }

    if (action === "unpublish") {
      await BusinessListing.updateMany({ _id: { $in: ids } }, { "businessDetails.publishedDate": action });
      return res.status(200).json({ status: true, message: "Listings unpublished successfully" });
    }

    if (action === "Rejected" || action === "Approved") {
      await BusinessListing.updateMany({ _id: { $in: ids } }, { "businessDetails.status": action });
      return res.status(200).json({ status: true, message: "Listings unpublished successfully" });
    }



  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const getAllListingsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const listings = await BusinessListing.find({ "contactPerson.userId": userId })
      .populate("businessCategory.category")
      .populate("businessCategory.subCategory")
      .populate("clickCounts.direction.user")
      .populate("clickCounts.share.user")
      .populate("clickCounts.contact.user")
      .populate("clickCounts.whatsapp.user")
      .populate("clickCounts.listings.user");

    if (!listings || listings.length === 0) {
      return res.status(404).json({ status: false, message: "No listings found for this user.", });
    }

    res.status(200).json({ status: true, message: "Listings fetched successfully", data: listings, });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ status: false, message: "Internal server error", error: err.message, });
  }
};


// export const searchBusinessListings = async (req: Request, res: Response) => {
//   const { query = "", pincode = "", state = "", title = "" } = req.query;
//   console.log("Incoming search@@@@:", { query, pincode, state, title });
//   try {
//     const regex = new RegExp(query as string, "i");
//     const pincodeRegex = new RegExp(`\\b${pincode}\\b`, "i");

//     let listings: any[] = [];

//     // Utility: filter only Approved or Published
//     const filterApproved = (data: any[]) =>
//       data.filter((listing: any) => {
//         const status = listing?.businessDetails?.status;
//         return status === "Published" || status === "Approved";
//       });

//     // === Case 1: CityPage ===
//     if (title === "CityPage") {
//       const cityQuery: any = {
//         $or: [
//           { "businessDetails.businessName": regex },
//           { "businessCategory.about": regex },
//           { "businessCategory.keywords": { $in: [regex] } },
//           { "businessCategory.businessService": regex },
//           { "businessCategory.category.name": regex },
//           { "businessCategory.subcategory.name": regex },

//         ],
//       };

//       // Add pincode and/or state to the filter if they exist
//       if (pincode) {
//         cityQuery.$or.push({ "businessDetails.pinCode": pincode });
//         cityQuery.$or.push({ "businessCategory.serviceArea": { $elemMatch: { $regex: pincodeRegex } } });
//       }
//       if (state) {
//         cityQuery.$or.push({ "businessDetails.state": state });
//       }

//       const allByLocation = await BusinessListing.find(cityQuery).populate(
//         "businessCategory.category businessCategory.subCategory"
//       );

//       listings = allByLocation.filter((listing: any) =>
//         listing?.businessCategory?.category?.name?.toLowerCase() === (query as string).toLowerCase()
//       );
//     }

//     // === Case 2: General Search ===
//     else {
//       const andConditions: any[] = [
//         {
//           $or: [
//             { "businessDetails.businessName": regex },
//             { "businessCategory.about": regex },
//             { "businessCategory.keywords": { $in: [regex] } },
//             { "businessCategory.businessService": regex },
//             { "businessCategory.serviceArea": { $elemMatch: { $regex: regex } } },
//           ],
//         },
//       ];

//       const locationConditions: any[] = [];
//       if (pincode) {
//         locationConditions.push({ "businessDetails.pinCode": pincode });
//         locationConditions.push({ "businessCategory.serviceArea": { $elemMatch: { $regex: pincodeRegex } } });
//       }
//       if (state) {
//         locationConditions.push({ "businessDetails.state": state });
//       }

//       if (locationConditions.length > 0) {
//         andConditions.push({ $or: locationConditions });
//       }

//       listings = await BusinessListing.find({ $and: andConditions }).populate(
//         "businessCategory.category businessCategory.subCategory"
//       );
//     }

//     const filteredListings = filterApproved(listings);

//     return res.status(200).json({ status: true, data: filteredListings });
//   } catch (error: any) {
//     console.error("Search error:", error.message);
//     return res.status(500).json({ status: false, message: "Internal server error", error: error.message, });
//   }
// };


// export const searchBusinessListings = async (req: Request, res: Response) => {
//   const { query = "", pincode = "", state = "", title = "" } = req.query;

//   console.log("Incoming search@@@@:", { query, pincode, state, title });

//   try {
//     const regex = new RegExp(query as string, "i");
//     const pincodeRegex = new RegExp(`\\b${pincode}\\b`, "i");

//     let listings: any[] = [];

//     // === Helper: filter only Approved or Published ===
//     const filterApproved = (data: any[]) =>
//       data.filter((listing: any) => {
//         const status = listing?.businessDetails?.status;
//         return status === "Published" || status === "Approved";
//       });

//     // === Case 1: CityPage ===
//     if (title === "CityPage") {
//       const cityQuery: any = {
//         $or: [
//           { "businessDetails.businessName": regex },
//           { "businessCategory.about": regex },
//           { "businessCategory.keywords": { $in: [regex] } },
//           { "businessCategory.businessService": regex },
//         ],
//       };

//       // Location filters
//       if (pincode) {
//         cityQuery.$or.push(
//           { "businessDetails.pinCode": pincode },
//           { "businessCategory.serviceArea": { $elemMatch: { $regex: pincodeRegex } } }
//         );
//       }

//       if (state) {
//         cityQuery.$or.push({ "businessDetails.state": state });
//       }

//       listings = await BusinessListing.find(cityQuery).populate(
//         "businessCategory.category businessCategory.subCategory"
//       );

//       // Try exact category match if possible
//       listings = listings.filter(
//         (listing: any) =>
//           listing?.businessCategory?.category?.name?.toLowerCase() === (query as string).toLowerCase()
//       );
//     }

//     // === Case 2: General Search ===
//     else {
//       const andConditions: any[] = [
//         {
//           $or: [
//             { "businessDetails.businessName": regex },
//             { "businessCategory.about": regex },
//             { "businessCategory.keywords": { $in: [regex] } },
//             { "businessCategory.businessService": regex },
//             { "businessCategory.serviceArea": { $elemMatch: { $regex: regex } } },
//           ],
//         },
//       ];

//       const locationConditions: any[] = [];
//       if (pincode) {
//         locationConditions.push(
//           { "businessDetails.pinCode": pincode },
//           { "businessCategory.serviceArea": { $elemMatch: { $regex: pincodeRegex } } }
//         );
//       }
//       if (state) {
//         locationConditions.push({ "businessDetails.state": state });
//       }

//       if (locationConditions.length > 0) {
//         andConditions.push({ $or: locationConditions });
//       }

//       listings = await BusinessListing.find({ $and: andConditions }).populate(
//         "businessCategory.category businessCategory.subCategory"
//       );
//     }

//     const filteredListings = filterApproved(listings);

//     return res.status(200).json({ status: true, data: filteredListings });
//   } catch (error: any) {
//     console.error("Search error:", error.message);
//     return res.status(500).json({
//       status: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };


const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchBusinessListings = async (req: Request, res: Response) => {
  const { query = "", pincode = "", state = "", title = "", page = 1, limit = 10 } = req.body;
  console.log("🔍 Incoming search:", { query, pincode, state, title, page, limit });

  try {
    const baseQuery: any = {};

    // query.length > 0 ? console.log("query.length",query.length) : console.log("HH2")
    if (query.length < 2) {
      return res.status(200).json({ status: true, data: [], });
    }
    // Step 1: Keyword Regex for business info

    if (query) {
      const keywordRegex = new RegExp(escapeRegex(query), "i");
      baseQuery.$or = [
        { "businessDetails.businessName": keywordRegex },
        { "businessCategory.categoryName": keywordRegex },
        { "businessCategory.subCategoryName": { $in: [keywordRegex] } },
        { "businessCategory.serviceArea": { $elemMatch: { $regex: keywordRegex } } },
      ];
    }

    // Step 2: Location Filters
    const locationFilters: any[] = [];
    const formattedState = capitalize(state.trim());
    const stateRegex = new RegExp(`^${escapeRegex(formattedState)}$`, "i");
    if (pincode) {
      const pincodeRegex = new RegExp(`\\b${escapeRegex(pincode)}\\b`, "i");
      const pincodeRegex2 = new RegExp(`(?:\\s|^)${escapeRegex(pincode)}(?:\\s|$)`, "i")
      locationFilters.push(
        { "businessDetails.pinCode": pincode },
        { "businessCategory.serviceArea": { $elemMatch: { $regex: pincodeRegex2 } } },
        { "businessDetails.state": stateRegex }
      );
    }

    if (state) {
      const formattedState = capitalize(state.trim());
      const stateRegex = new RegExp(`^${escapeRegex(formattedState)}$`, "i");
      locationFilters.push({ "businessDetails.state": stateRegex });
    }
    console.log("locationFilters==>", locationFilters)
    if (locationFilters.length > 0) {
      baseQuery.$and = [{ $or: locationFilters }];
    }

    // Step 3: Run query
    let listings = await BusinessListing.find(baseQuery)
      .populate("businessCategory.category businessCategory.subCategory");

    // Step 4: CityPage-specific filter (exact category name match)
    if (title === "CityPage" && query) {
      listings = listings.filter((listing: any) =>
        listing.businessCategory?.category?.name?.toLowerCase() === query.toLowerCase()
      );
    }

    // Step 5: Filter status
    const filteredListings = listings.filter((listing: any) => {
      const status = listing.businessDetails?.status;
      return status === "Published" || status === "Approved";
    });

    //     // Step 6: Pagination
    const total = filteredListings.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = filteredListings.slice(start, start + limit);


    // return res.status(200).json({
    //   status: true,
    //   data: filteredListings,
    // });

    return res.status(200).json({ status: true, data: paginated, total, totalPages, currentPage: page, });

  } catch (error: any) {
    console.error("❌ Search Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const increaseClickCount = async (req: Request, res: Response) => {

  try {
    type ClickType = "direction" | "share" | "contact" | "website" | "whatsapp" | "listings";

    interface ClickDetail {
      count: number;
      user: mongoose.Types.ObjectId[];
    }

    interface ClickCounts {
      direction?: ClickDetail;
      share?: ClickDetail;
      contact?: ClickDetail;
      website?: ClickDetail;
      whatsapp?: ClickDetail;
      listings?: ClickDetail;
    }

    const allowedClickTypes: ClickType[] = ["direction", "share", "contact", "website", "whatsapp", "listings"];
    const { type, user }: { type: ClickType; user: string } = req.body;
    console.log("🚀 Click type:s", type);
    const businessId = req.params.id;

    if (!type || !allowedClickTypes.includes(type)) {
      return res.status(400).json({ status: false, message: "Invalid or missing click type." });
    }

    if (!user) {
      return res.status(400).json({ status: false, message: "Missing userId in body." });
    }

    const business = await BusinessListing.findById(businessId);

    if (!business) {
      return res.status(404).json({ status: false, message: "Business not found." });
    }

    // Force init clickCounts
    if (!business.clickCounts) {
      business.clickCounts = {};
    }

    // Safely initialize or retrieve current click count object
    const currentClick: ClickDetail = business.clickCounts[type] ?? {
      count: 0,
      user: [],
    };

    // Ensure user is ObjectId
    const userObjectId = new mongoose.Types.ObjectId(user);

    // Check if user already clicked
    const hasClicked = currentClick.user.some((u) => u.toString() === userObjectId.toString());

    if (!hasClicked) {
      currentClick.user.push(userObjectId);
    }

    currentClick.count += 1;

    // Assign back to business model
    business.clickCounts[type] = currentClick;

    await business.save();

    return res.status(200).json({ status: true, message: `${type} click count incremented.`, updatedCounts: currentClick, });
  } catch (error: any) {
    console.error("Click count error:", error);
    return res.status(500).json({ status: false, message: error.message || "Server error." });
  }
};

export const postReviewAllListingsById = async (req: Request, res: Response) => {
  try {
    console.log("BODY:->", req.body);

    const listing = await BusinessListing.findById(req.params.id);
    if (!listing) {
      return res.status(204).json({ status: false, message: "Business listing not found" });
    }

    // Extract and format review fields properly
    const review = {
      author: req.body['reviews[author]'],
      comment: req.body['reviews[comment]'],
      rating: parseInt(req.body['reviews[rating]']),
      user: req.body['reviews[user]'],
    };

    // Basic validation
    if (!review.author || !review.comment || isNaN(review.rating) || !review.user) {
      return res.status(200).json({ status: false, message: "Missing or invalid review fields" });
    }

    // Check if the user already added a review
    // const alreadyReviewed = listing.reviews.some(r => r.user.toString() === review?.user);
    const alreadyReviewed = listing.reviews.some(
      r => r.user && r.user.toString() === review?.user
    );
    if (alreadyReviewed) {
      return res.status(200).json({
        status: false,
        message: "You have already submitted a review for this business listing.",
      });
    }

    // Add the review
    listing.reviews.push(review);
    // await listing.save();

    const updatedListing = await BusinessListing.findByIdAndUpdate(req.params.id, listing, { new: true });
    if (!updatedListing) {
      return res.status(204).json({ status: false, message: "Business listing not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Review added successfully",
      data: listing.reviews[listing.reviews.length - 1],
    });

  } catch (error: any) {
    console.error("Error adding review:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
};


export const updateBusinessListingTrust = async (req: Request, res: Response) => {
  try {
    const { trust } = req.body;

    const listing = await BusinessListing.findByIdAndUpdate(req.params.id, { trust }, { new: true });

    if (!listing) {
      return res.status(404).json({ status: false, message: "Business listing not found", });
    }

    res.status(200).json({ status: true, message: "Business listing verification status updated successfully", data: listing, });
  } catch (error: any) {
    res.status(500).json({ status: false, message: "Error updating verification status", error: error.message, });
  }
};


export const getBusinessListingsByCategoryAndState = async (req: Request, res: Response) => {
  try {
    const { category, state } = req.body;
    const listings = await BusinessListing.find({ 'businessCategory.categoryName': category }).populate('businessCategory.category').populate('businessCategory.subCategory').populate("contactPerson.userId");
    res.status(200).json({ status: true, message: "Business listings retrieved successfully", data: listings, });
  } catch (error: any) {
    res.status(500).json({ status: false, message: "Error retrieving business listings", error: error.message, });
  }
}


// DELETE /reviews/:listingId/:reviewId
export const deleteReview = async (req: Request, res: Response) => {
  const { listingId, reviewId } = req.params;

  try {
    const result = await BusinessListing.updateOne(
      { _id: listingId },
      { $pull: { reviews: { _id: reviewId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Review not found or already deleted" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};
