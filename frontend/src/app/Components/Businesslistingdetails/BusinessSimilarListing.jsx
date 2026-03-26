"use client";

import React, { useEffect, useState } from "react";
import "../../pages/bussiness-listing/businessListing.css";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { getData, postData } from "../../services/FetchNodeServices";
import verifyImage from "../../Images/verifed.png";
import trustImage from "../../Images/trusted.png";

let slugify = (text = "") => text.toLowerCase().trim().replace(/,/g, "--").replace(/&/g, "and").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

const BusinessSimilarListing = ({ category, id }) => {
  const [similarBusinesses, setSimilarBusinesses] = useState([]);
  const [planData, setPlanData] = useState([]);

  useEffect(() => {
    const fetchListingByCategory = async () => {
      try {
        const response = await postData("get-business-listings-by-category-and-state", { category });
        if (response?.status === true) {
          const filtered = response.data.filter(
            (listing) =>
              listing?.businessDetails?.status === "Approved" &&
              listing?._id !== id
          );
          setSimilarBusinesses(filtered || []);
        }
      } catch (error) {
        console.error("Error fetching similar listings:", error);
      }
    };

    if (category) fetchListingByCategory();
  }, [category, id]);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await getData("membership/get-all-memberships");
        if (response?.status === true) {
          setPlanData(response.data);
        }
      } catch (error) {
        console.error("Error fetching plan data:", error);
      }
    };
    fetchPlanData();
  }, []);

  const isBusinessOpenNow = (timing = []) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()];
    const todayTiming = timing.find((item) => item.day === today);
    return todayTiming?.isOpen ?? false;
  };

  const calculateAvgRating = (reviews = []) => {
    if (!reviews.length) return "0.0";
    const total = reviews.reduce((sum, r) => sum + (r?.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  const capitalizeWords = (str) =>
    str?.toLowerCase()?.split(" ")?.map((word) => word?.charAt(0).toUpperCase() + word?.slice(1)).join(" ");

  return (
    <div className="container mt-4">
      <h3 className="text-center fw-bold text-dark mb-4">Similar Listings</h3>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          320: { slidesPerView: 1 },
          576: { slidesPerView: 1 },
          992: { slidesPerView: 2 },
        }}
      >
        {similarBusinesses.map((biz) => {
          const openNow = isBusinessOpenNow(biz?.businessTiming);
          const avgRating = calculateAvgRating(biz?.reviews);
          const image = biz?.businessCategory?.businessImages?.[0] || "/placeholder.jpg";
          const name = capitalizeWords(biz?.businessDetails?.businessName || "Unnamed Business");

          // Check if the business exists in the planData list
          const matchedPlans = planData?.filter(
            (plan) => plan?.businessId?.businessDetails?.businessName === biz?.businessDetails?.businessName
          );

          // console.log("XXXXX:==>hhhh", biz, id)
          return (
            <SwiperSlide key={biz?._id}>
              <Link onClick={() => localStorage.setItem("biziffyListingId", biz?._id)} href={`/pages/bussiness-listing/${slugify(biz?.businessDetails?.businessName)}`} className="text-decoration-none">
                <div className="d-flex align-items-center gap-3 p-2 p-sm-3 border rounded shadow-sm bg-white hover-shadow transition-all" style={{ width: "100%" }}>
                  <div className="flex-shrink-0">
                    <Image
                      src={image}
                      alt={name}
                      width={100}
                      height={100}
                      priority
                      className="rounded"
                      style={{ objectFit: "cover", border: "1px solid #ccc" }}
                    />
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-1 text-dark">
                        {name.length > 45 ? `${name.slice(0, 45)}...` : name}
                      </h5>

                      {matchedPlans?.length > 0 && (
                        // <div className="d-flex gap-2">
                        //   {(biz?.trust === "Approved" || biz?.trust === true) && (
                        //     <Image src={trustImage} alt="Trust Badge" width={30} height={30} className="verify-img" 
                        //       priority />
                        //   )}
                        //   {(biz?.verified === "Approved" || biz?.verified === true) && (
                        //     <Image src={verifyImage} alt="Verified Badge" width={20} height={20} className="verify-img" 
                        //       priority />
                        //   )}
                        // </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          {(biz?.trust === "Approved" ||
                            JSON.parse(biz?.trust)) && (
                              <button className="premium-listing-trust">
                                Trusted{" "}
                                <i className="bi bi-shield-check"></i>
                              </button>
                            )}
                          {(biz?.verified === "Approved" ||
                            JSON.parse(biz?.verified)) && (
                              <button className="premium-listing-verified">
                                Verified{" "}
                                <i className="bi bi-check2-all"></i>
                              </button>
                            )}
                        </div>
                      )}
                    </div>

                    <div className="d-flex flex-wrap gap-2 align-items-center text-muted small">
                      <span>{avgRating}</span>
                      <span>|</span>
                      <span>
                        {[...Array(Math.floor(avgRating))].map((_, i) => (
                          <i key={i} className="bi bi-star-fill"></i>
                        ))}
                      </span>
                      {biz?.reviews?.length > 0 && (
                        <>
                          <span>|</span>
                          <span>{biz.reviews.length} reviews</span>
                        </>
                      )}
                      <span>|</span>
                      <span>{capitalizeWords(biz?.businessCategory?.category?.name)}</span>
                    </div>

                    <div className="d-flex flex-wrap gap-2 align-items-center text-muted small mt-1">
                      <span>{biz?.businessDetails?.yib || "0.6"} years in business</span>
                      <span>|</span>
                      <span>{biz?.businessDetails?.city}, {biz?.businessDetails?.state}</span>
                    </div>

                    <div className="d-flex flex-wrap gap-2 align-items-center text-muted small mt-1">
                      <span className={`fw-semibold ${openNow ? "text-success" : "text-danger"}`}>
                        {openNow ? "Open Now" : "Closed Now"}
                      </span>
                      <span>|</span>
                      <span>Mobile: {biz?.contactPerson?.contactNumber}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default BusinessSimilarListing;
