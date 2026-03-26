"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getData, postData } from "../../services/FetchNodeServices";
import Swal from "sweetalert2";
import { useRazorpay } from "react-razorpay";
import "./checkout.css";

const monthPlan = [{ name: '1 Month', id: 1 }, { name: '3 Month', id: 3 }, { name: '6 Month', id: 6 }, { name: '12 Month', id: 12 }];

const CheckoutPage = () => {
  const router = useRouter();
  const { Razorpay } = useRazorpay();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "", fullName: "", country: "", city: "", state: "", pinCode: "",
    phone: "", gstin: "", businessname: "", street: "", paymentMethod: "Online", month: 1
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [businessListing, setBusinessListing] = useState([]);

  // ✅ Fix: Add router to dependency array
  useEffect(() => {
    const plan = localStorage.getItem("selectedPlan");
    if (plan) setSelectedPlan(JSON.parse(plan));

    const storedUser = localStorage.getItem("biziffyUser");
    if (!storedUser) return router.push("/pages/login");

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setFormData(prev => ({
      ...prev,
      email: userData.email,
      fullName: userData.fullName || "",
      buildingNo: userData?.address?.addressLine1 || "",
      street: userData?.address?.addressLine2 || "",
      state: userData?.address?.state || "",
      pinCode: userData?.address?.pinCode || "",
      city: userData?.address?.city || "",
    }));
  }, [router]);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (user?._id) {
        const res = await getData(`get-all-listings-by-user-id/${user._id}`);
        if (res?.status) setBusinessListing(res.data);
      }
    };
    fetchBusiness();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateTotal = () => {
    return selectedPlan?.price * formData?.month || 0;
  };

  const calculateTax = () => {
    const total = calculateTotal();
    return +(total * 0.18).toFixed(2);
  };

  const totalWithTax = () => {
    const total = calculateTotal();
    const discountedTotal = total - (total * discount) / 100;
    const tax = discountedTotal * 0.18;
    return +(discountedTotal + tax).toFixed(2);
  };

  const applyDiscount = async () => {
    const res = await postData("coupon/get-coupon-by-code", { code: couponCode });
    if (res?.status === true) setDiscount(res.data.discount);
  };
  // console.log("HHHHHH:=>",formData)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      Swal.fire("Error", "User not logged in!", "error");
      return;
    }

    Swal.fire({
      title: "Confirm Your Plan Purchase",
      text: "Are you sure you want to purchase this plan? Once confirmed, it will be activated on your account.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Purchase Plan",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const payload = {
        user: user?._id,
        email: formData?.email,
        name: formData.fullName,
        phone: formData?.phone,
        // country: formData?.country,
        gstin: formData?.gstin,
        address: {
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          street: formData.street,
        },
        businessId: formData.businessname,
        paymentMethod: formData.paymentMethod,
        totalAmount: totalWithTax(),
        planDetails: selectedPlan,
        duration: formData?.month,
        couponDiscount: discount,
      };

      try {
        const res = await postData("membership/create-memberships", payload);
        const resData = res?.data;
        if (res.status === true) {
          const { razorpayOrder } = res;
          const options = {
            key: 'rzp_live_R8ji659dMSY49p',
            // "rzp_test_TmsfO3hloFEA31",
            // rzp_live_R7TdCFbNwirfsH
            amount: razorpayOrder.amount,
            currency: "INR",
            name: "biziffy",
            description: "Checkout Payment",
            order_id: razorpayOrder.id,
            handler: async (response) => {
              const verifyResponse = await postData("membership/verify-payment", {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response?.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                order_id: resData.checkout?.orderId,
              });
              if (verifyResponse?.success) {
                Swal.fire("Success", "Your plan has been successfully activated!", "success");
                router.push("/");
              } else {
                const id = razorpayOrder?._id
                await getData(`membership/delete-membership/${id}`)
                Swal.fire("Error", "Payment verifcation failed", "error");
              }
            },
            prefill: {
              name: formData.fullName,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: "#F37254",
            },
          };
          const rzp = new Razorpay(options);
          rzp.open();
        } else {
          Swal.fire("Error", res?.message || "Order creation failed", "error");
        }
      } catch (error) {
        console.error("Order error:", error);
        Swal.fire("Error", "Something went wrong. Try again.", "error");
      }
    });
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!user?._id) return Swal.fire("Error", "User not logged in!", "error");

  //   Swal.fire({
  //     title: "Confirm Your Plan Purchase",
  //     text: "Proceed with payment?",
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Pay",
  //   }).then(async (result) => {
  //     if (!result.isConfirmed) return;

  //     try {
  //       const res = await postData("membership/create-memberships", {
  //         user: user._id,
  //         email: formData.email,
  //         name: formData.fullName,
  //         phone: formData.phone,
  //         gstin: formData.gstin,
  //         address: {
  //           city: formData.city,
  //           state: formData.state,
  //           pinCode: formData.pinCode,
  //           street: formData.street,
  //         },
  //         businessId: formData.businessname,
  //         paymentMethod: "Online",
  //         totalAmount: totalWithTax(),
  //         planDetails: selectedPlan,
  //         duration: formData.month,
  //         couponDiscount: discount,
  //       });

  //       if (!res?.status) return Swal.fire("Error", res?.message || "Order creation failed", "error");

  //       const { razorpayOrder, checkout } = res;

  //       const options = {
  //         key: "rzp_live_R8ji659dMSY49p",
  //         amount: razorpayOrder.amount,
  //         currency: "INR",
  //         name: "Biziffy",
  //         description: "Membership Payment",
  //         order_id: razorpayOrder.id, // 🔥 required
  //         handler: async (response) => {
  //           const verifyRes = await postData("membership/verify-payment", {
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_signature: response.razorpay_signature,
  //             order_id: checkout.orderId,
  //           });

  //           if (verifyRes?.success) {
  //             Swal.fire("Success", "Your plan has been activated!", "success");
  //             router.push("/");
  //           } else {
  //             Swal.fire("Error", "Payment verification failed", "error");
  //           }
  //         },
  //         prefill: {
  //           name: formData.fullName,
  //           email: formData.email,
  //           contact: formData.phone,
  //         },
  //         theme: { color: "#F37254" },
  //       };

  //       const rzp = new Razorpay(options);
  //       rzp.open();
  //     } catch (error) {
  //       console.error("Order error:", error);
  //       Swal.fire("Error", "Something went wrong. Try again.", "error");
  //     }
  //   });
  // };

  return (
    <section className="checkout container py-5">
      <div className="row g-4">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="checkout-form shadow p-4 rounded bg-white">
            <h3 className="mb-3 text-primary">Business Details</h3>
            <div className="row">
              <div className="col-md-6">
                <select
                  name="businessname"
                  value={formData.businessname}
                  onChange={handleChange}
                  className="form-select mb-3"
                  required
                >
                  <option value="">Select Your Listing</option>
                  {businessListing?.map((listing) => (
                    <option key={listing?._id} value={listing?._id}>
                      {listing?.businessDetails?.businessName}
                    </option>
                  ))}
                </select>
              </div>

              {/* ✅ Fix: Added `key` prop to map */}
              {["fullName", "email", "phone", "gstin", "buildingNo", "street", "city", "state", "pinCode"].map((field) => (
                <div className="col-md-6" key={field}>
                  <input
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="form-control mb-3"
                    required={field !== "gstin"}
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-primary w-100">Place Order</button>
          </form>
        </div>

        <div className="col-md-6">
          <div className="order-summary shadow p-4 rounded bg-white">
            <h3 className="mb-4 text-primary">Order Summary</h3>
            <div className="mb-3">
              <label className="form-label">Select Duration (Months)</label>
              <select
                name="month"
                value={formData?.month}
                onChange={handleChange}
                className="form-select mb-3"
                required
              >
                {monthPlan.map((month) => (
                  <option key={month?.id} value={month?.id}>
                    {month?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="summary">
              <p>Subtotal: ₹{calculateTotal()}</p>
              <p>Tax (18%): ₹{calculateTax()}</p>
              {discount > 0 && <p>Discount: {discount}%</p>}
              <div className="mb-3">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter Coupon Code"
                  className="form-control mb-2"
                />
                <button type="button" onClick={applyDiscount} className="btn btn-outline-success w-100">
                  Apply
                </button>
              </div>
              <hr />
              <h5>Total: ₹{totalWithTax()}</h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
