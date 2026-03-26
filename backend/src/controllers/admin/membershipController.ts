import { Request, Response } from "express";
import { Membership } from "../../models/membershipModel";
import ShortUniqueId from "short-unique-id";
import crypto from "crypto";
import Razorpay from "razorpay";
import { sendPlanActivationEmail } from "../../middleware/sendPlanActivationEmail";
import { userInfo } from "os";
import { sendPlanAcourdingEmail } from "../../middleware/sendPlanAcourdingEmail";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_live_R8ji659dMSY49p",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "vtUJxLeIpgNejXvHPjRnXElT",
});

const generateOrderUniqueId = async (): Promise<string> => {
  const lastMembership = await Membership.findOne({})
    .sort({ createdAt: -1 }) // Get latest
    .select("orderUniqueId")
    .lean();

  if (!lastMembership || !lastMembership.orderUniqueId) {
    return "BIZ01";
  }

  const lastId = lastMembership.orderUniqueId;
  const lastNumber = parseInt(lastId.replace("BIZ", ""), 10);
  const nextNumber = lastNumber + 1;
  const paddedNumber = String(nextNumber).padStart(2, "0");
  return `BIZ${paddedNumber}`;
};

export const createMembershipOrder = async (req: Request, res: Response) => {
  try {
    const {
      user,
      name,
      phone,
      address,
      businessId,
      paymentMethod,
      totalAmount,
      planDetails,
      duration,
      gstin,
      couponDiscount,
    } = req.body;

    if (!user || !name || !phone || !address || !paymentMethod || !planDetails || !totalAmount) {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    // Check if already exists
    const alreadyExists = await Membership.findOne({ user, businessId });
    if (alreadyExists) {
      return res.status(200).json({
        status: false,
        message: "In this Listing Membership already exists",
      });
    }

    // Generate Unique Order ID
    const orderUniqueId = await generateOrderUniqueId();

    const membershipData = {
      user,
      name,
      phone,
      address,
      businessId,
      plan: planDetails.name,
      planDetails,
      gstin,
      duration: Number(duration),
      totalAmount: Number(totalAmount),
      couponDiscount: couponDiscount || 0,
      orderUniqueId,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Initiated",
      paymentMethod,
      status: false,
      history: [{ status: "Pending", date: new Date() }],
    };

    // COD Handling
    if (paymentMethod === "COD") {
      await Membership.create(membershipData);
      return res.status(201).json({
        status: true,
        message: "Membership created with Cash on Delivery",
        orderId: orderUniqueId,
      });
    }

    // Online Payment - Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(totalAmount) * 100), // paise
      currency: "INR",
      receipt: orderUniqueId,
      notes: {
        userId: String(user),
        planName: planDetails.name,
        duration: String(duration),
      },
    });

    // Save before payment
    await Membership.create(membershipData);

    return res.status(200).json({
      status: true,
      message: "Razorpay order created",
      razorpayOrder,
      data: {
        checkout: {
          _id: razorpayOrder.id,
          orderId: orderUniqueId,
        },
      },
    });
  } catch (err) {
    console.error("createMembershipOrder error:", err);
    return res.status(500).json({ status: false, message: "Server error during order creation" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return res.status(400).json({ success: false, message: "Incomplete payment data" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ success: false, message: "Missing Razorpay key secret" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Signature mismatch. Payment verification failed.",
      });
    }


    // Option 1: Get metadata from DB using `order_id`
    const session = await Membership.findOne({ orderUniqueId: order_id }).populate("businessId").populate("user");
    if (!session) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Option 2 (if you send metadata in frontend with verify request): Uncomment and use this instead
    // const { user, name, phone, address, businessId, planDetails, duration, couponDiscount, totalAmount } = req.body.metadata;

    // Update membership with payment info
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + Number(session.duration || 1));

    session.paymentStatus = "Paid";
    session.status = true;
    session.paymentMethod = "Razorpay"
    session.startDate = startDate;
    session.endDate = endDate;
    session.history.push({ status: "Active", date: new Date() });

    await session.save();
    console.log("session:=>>>", session)
    const planName = (session?.planDetails as any)?.name;
    const businessName = (session?.businessId as any)?.businessDetails?.businessName;
    const email = (session?.user as any)?.email;

    await sendPlanActivationEmail(email, businessName, planName);

    // await sendDownloadBillEmail(session);

    return res.status(200).json({ success: true, message: "Payment verified and membership activated", });
  } catch (error) {
    console.error("verifyPayment error:", error);
    return res.status(500).json({ success: false, message: "Server error during payment verification", });
  }
};



// export const createMembershipOrder = async (req: Request, res: Response) => {
//   try {
//     const { user, name, phone, address, businessId, paymentMethod, totalAmount, planDetails, duration, gstin, couponDiscount } = req.body;

//     if (!user || !name || !phone || !address || !paymentMethod || !planDetails || !totalAmount) {
//       return res.status(400).json({ status: false, message: "Missing required fields" });
//     }

//     const alreadyExists = await Membership.findOne({ user, businessId });
//     if (alreadyExists) {
//       return res.status(200).json({ status: false, message: "Membership already exists for this listing" });
//     }

//     const orderUniqueId = await generateOrderUniqueId();

//     const razorpayOrder = await razorpay.orders.create({
//       amount: Math.round(Number(totalAmount) * 100), // convert to paise
//       currency: "INR",
//       receipt: orderUniqueId,
//       notes: {
//         userId: String(user),
//         planName: planDetails.name,
//         duration: String(duration),
//       },
//     });

//     // Save with "Initiated"
//     await Membership.create({
//       user,
//       name,
//       phone,
//       address,
//       businessId,
//       plan: planDetails.name,
//       planDetails,
//       gstin,
//       duration: Number(duration),
//       totalAmount: Number(totalAmount),
//       couponDiscount: couponDiscount || 0,
//       orderUniqueId,
//       razorpayOrderId: razorpayOrder.id, // 🔥 store order id for verification
//       paymentStatus: "Initiated",
//       paymentMethod,
//       status: false,
//       history: [{ status: "Pending", date: new Date() }],
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Razorpay order created",
//       razorpayOrder,
//       checkout: { orderId: orderUniqueId },
//     });
//   } catch (err) {
//     console.error("createMembershipOrder error:", err);
//     return res.status(500).json({ status: false, message: "Server error during order creation" });
//   }
// };

// export const verifyPayment = async (req: Request, res: Response) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
//       return res.status(400).json({ success: false, message: "Incomplete payment data" });
//     }

//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "vtUJxLeIpgNejXvHPjRnXElT")
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Signature mismatch" });
//     }

//     const session = await Membership.findOne({ orderUniqueId: order_id }).populate("businessId").populate("user");
//     if (!session) return res.status(404).json({ success: false, message: "Order not found" });

//     const startDate = new Date();
//     const endDate = new Date();
//     endDate.setMonth(endDate.getMonth() + Number(session.duration || 1));

//     session.paymentStatus = "Paid";
//     session.status = true;
//     session.paymentMethod = "Razorpay";
//     session.startDate = startDate;
//     session.endDate = endDate;
//     session.history.push({ status: "Active", date: new Date() });

//     await session.save();

//     await sendPlanActivationEmail((session.user as any).email, (session.businessId as any).businessDetails.businessName, (session.planDetails as any).name);

//     return res.status(200).json({ success: true, message: "Payment verified and membership activated" });
//   } catch (error) {
//     console.error("verifyPayment error:", error);
//     return res.status(500).json({ success: false, message: "Server error during payment verification" });
//   }
// };

export const getAllMemberships = async (req: Request, res: Response) => {
  try {
    const memberships = await Membership.find().sort({ _id: -1 }).populate("businessId").populate("user");
    res.status(200).json({ status: true, data: memberships });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch memberships" });
  }
};


export const updateMembership = async (req: Request, res: Response) => {
  try {
    const updated = await Membership.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update membership" });
  }
};

export const deleteMembership = async (req: Request, res: Response) => {
  try {
    console.log("req.params.id:=>", req.params.id)
    const deletedMembership = await Membership.findByIdAndDelete(req.params.id);

    if (!deletedMembership) {
      return res.status(404).json({ error: "Membership not found" });
    }

    res.status(200).json({ message: "Membership deleted successfully", status: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete membership" });
  }
};

export const statusMembership = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status (must be true or false)
    if (typeof status !== "boolean") {
      return res.status(400).json({ status: false, message: "Status must be a boolean" });
    }

    const updated = await Membership.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ status: false, message: "Membership not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Membership status updated successfully",
      data: updated,
    });

  } catch (err) {
    console.error("Error in statusMembership:", err);
    return res.status(500).json({ status: false, message: "Failed to update membership" });
  }
};

export const getAllMembershipsByUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id; // ✅ FIXED HERE
    console.log("userId:=>", id);

    const memberships = await Membership.find({ user: id })
      .populate("businessId")
      .populate("user");

    res.status(200).json({ status: true, data: memberships });
  } catch (err) {
    console.error("Error fetching memberships:", err);
    res.status(500).json({ status: false, error: "Failed to fetch memberships" });
  }
};

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const { emailPopup, message } = req.body;

    const plan = emailPopup?.planDetails?.name;
    const businessName = emailPopup?.businessId?.businessDetails?.businessName;
    const email = emailPopup?.user?.email;
    console.log("plan, businessName, email, message:=>", plan, businessName, email, message)
    // Validate required fields
    if (!plan || !businessName || !email) {
      return res.status(200).json({ status: false, error: "Missing plan, business name, or email information.", });
    }

    // Await the email sending function

    await sendPlanAcourdingEmail(plan, businessName, email, message);

    return res.status(200).json({ status: true, message: "Email sent successfully", });
  } catch (err) {
    console.error("Error sending plan activation email:", err);
    return res.status(500).json({ status: false, error: "Failed to send email", });
  }
};