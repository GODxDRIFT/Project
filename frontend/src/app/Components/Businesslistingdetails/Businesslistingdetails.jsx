"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import gourav from "../../Images/gourav.jpg";
import gourav2 from "../../Images/gourav2.jpg";
import gourav3 from "../../Images/gourav3.jpg";
import "../../pages/bussiness-listing/businessListing.css";
import BusinessSimilarListing from "./BusinessSimilarListing";
import ListingPageFaq from "./ListingPageFaq";
import { useRouter } from "next/navigation";
import { getData, postData } from "../../services/FetchNodeServices";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Keyboard } from "swiper/modules";

const Businesslistingdetails = ({
  businesses,
  advertisements,
  fetchBusinessDetails,
  Id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState({ businesses });
  const [reviews, setReviews] = useState(businesses?.reviewsData || []);
  const [newReview, setNewReview] = useState({
    author: "",
    comment: "",
    rating: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAllHours, setShowAllHours] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState("");
  const [planData, setPlanData] = useState([]);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    phone: "",
    requirement: "",
    user: "",
    category: businesses?.businessCategory?.category?.name,
  });
  const router = useRouter();

  ("Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium error, odio eos, nostrum animi quae facilis possimus consequatur id ipsum odit iure hic, debitis voluptas iusto eligendi tenetur nam omnis blanditiis quos magni porro? Dolore nostrum voluptatem dolorem natus totam tempore cum distinctio ea excepturi. Consectetur enim dolor ut ea dicta mollitia provident possimus placeat consequatur ab quasi neque laudantium recusandae aliquid nobis sapiente illum eum est reiciendis, rerum perspiciatis, corporis exercitationem. In voluptatum dignissimos quibusdam asperiores exercitationem nobis perferendis voluptate magnam alias beatae accusamus non reprehenderit adipisci placeat ex consequatur, unde eaque enim consequuntur debitis molestiae saepe officiis aut!");

  // Static Data
  const staticPhotos = [gourav, gourav2, gourav3, gourav, gourav2, gourav3];

  const visiblePhotos = showAll ? staticPhotos : staticPhotos.slice(0, 4);
  const wordLimit = 30;

  const aboutText = businesses?.businessCategory?.about || "";
  const words = aboutText.split(" ");
  const isLongText = words.length > wordLimit;

  const toggleText = () => {
    setExpanded((prev) => !prev);
  };
  useEffect(() => {
    const storedData = localStorage.getItem("biziffyUser");
    const userData = JSON.parse(storedData);
    setNewReview({ ...newReview, user: userData?._id });
  }, []);

  const handleAddReview = async () => {
    if (newReview.author.trim() && newReview.comment.trim()) {
      const body = {
        "reviews[author]": newReview.author,
        "reviews[comment]": newReview.comment,
        "reviews[rating]": newReview.rating,
        "reviews[user]": newReview.user,
      };

      try {
        const response = await postData(
          `admin/post-review-all-listings-by-id/${businesses?._id}`,
          body
        );
        if (response?.status || response?.data?.status) {
          const updatedReviews = [...reviews, newReview];
          setReviews(updatedReviews);
          setNewReview({ author: "", comment: "", rating: 0, user: "" });
          toast.success("Review added successfully!");
          fetchBusinessDetails(Id);

          setShowForm(false);
        } else {
          toast.error(
            response.message || "Failed to add review. Please try again."
          );
        }
      } catch (error) {
        console.error("Error adding review:", error);
        toast.error("Something went wrong. Please try again later.");
      }
    } else {
      toast.warn("Please fill in author and comment fields.");
    }
  };

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightbox(true);
  };

  const closeLightbox = (event) => {
    if (
      event.target.classList.contains("lightbox-overlay") ||
      event.target.classList.contains("close-btn")
    ) {
      setLightbox(false);
    }
  };

  const getCurrentDay = () => {
    const today = new Date().getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    return today === 0 ? 6 : today - 1; // Adjust so Monday = 0, ..., Sunday = 6
  };

  const isCurrentlyOpen = (openTime, openPeriod, closeTime, closePeriod) => {
    if (openTime === "Closed" || closeTime === "Closed") return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const convertToMinutes = (timeStr, period) => {
      let [hour, minute] = timeStr.split(":").map(Number);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return hour * 60 + minute;
    };

    const openMinutes = convertToMinutes(openTime, openPeriod);
    const closeMinutes = convertToMinutes(closeTime, closePeriod);

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  };

  useEffect(() => {
    const todayIndex = getCurrentDay();
    const todayTiming = businesses?.businessTiming?.[todayIndex];
    if (todayTiming?.isOpen === true) {
      const open = isCurrentlyOpen(
        todayTiming?.openTime,
        todayTiming?.openPeriod,
        todayTiming?.closeTime,
        todayTiming?.closePeriod
      );
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [businesses]);
  useEffect(() => {
    const user = localStorage.getItem("biziffyUser");
    setUser(JSON.parse(user)?._id);
    setEnquiryForm({ ...enquiryForm, user: JSON.parse(user)?._id });
  }, []);

  const handleCountClick = (type) => {
    setTimeout(async () => {
      const businessId = businesses?._id;
      if (!businessId || !type) return;

      const key = `business_click_${businessId}_${type}`;
      const lastClickDay = localStorage.getItem(key);
      const now = Date.now();
      const currentDay = Math.floor(now / 86400000);

      if (!lastClickDay || parseInt(lastClickDay) < currentDay) {
        postData(`increase-click-count/${businessId}`, { type, user })
          .then(() => {
            localStorage.setItem(key, currentDay.toString());
          })
          .catch((err) => {
            console.error("Error increasing count", err);
          });
      } else {
      }
    }, 3000);
  };

  const today = getCurrentDay();
  const handleEnquiryForm = async (e) => {
    e.preventDefault();

    const { name, phone, requirement } = enquiryForm;

    // 🔍 Validations
    if (!name.trim() || name.trim().length < 2) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid Name",
        text: "Please enter a valid name with at least 2 characters.",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid Phone Number",
        text: "Phone number must be exactly 10 digits.",
      });
    }

    if (!requirement.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Requirement Missing",
        text: "Please describe what you are looking for.",
      });
    }

    // 🌀 Submit if all validations pass
    try {
      const loading = Swal.fire({
        title: "Submitting…",
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
      });

      const response = await postData("enquiries/create-enquiryform", {
        ...enquiryForm,
      });

      loading.close();

      if (response) {
        setEnquiryForm({ name: "", phone: "", requirement: "" });
        Swal.fire({
          icon: "success",
          title: "Enquiry submitted!",
          text: "We'll get back to you shortly.",
          toast: true,
          position: "top-end",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Submission failed",
          text: "Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      Swal.fire({
        icon: "error",
        title: "Oops…",
        text: "Something went wrong while submitting your enquiry.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const renderStatusBadge = (status) => {
    const baseStyle = {
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: 500,
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    };

    if (status === "Approved") {
      return (
        <span
          style={{ ...baseStyle, backgroundColor: "#d4edda", color: "#155724" }}
        >
          <i className="bi bi-patch-check-fill" /> Approved
        </span>
      );
    } else if (status === "Pending") {
      return (
        <span
          style={{ ...baseStyle, backgroundColor: "#fff3cd", color: "#856404" }}
        >
          <i className="bi bi-clock-fill" /> Pending
        </span>
      );
    } else {
      return (
        <span
          style={{ ...baseStyle, backgroundColor: "#f8d7da", color: "#721c24" }}
        >
          <i className="bi bi-x-circle-fill" /> Rejected
        </span>
      );
    }
  };
  const filter =
    advertisements?.filter(
      (ad) => ad?.categoryName === businesses?.businessCategory?.category?.name
    ) || [];
  const handleShare = async () => {
    setTimeout(async () => {
      const shareData = {
        title: "Biziffy Listing",
        text: "Check out this business listing!",
        url: window.location.href,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
          handleCountClick("share");
        } else {
          await navigator.clipboard.writeText(shareData.url);
          alert("Link copied to clipboard!");
        }
      } catch (error) {
        console.error("Sharing failed", error);
      }
    }, 3000);
  };
  const handleIcone = (platform) => {
    Swal.fire({
      icon: "info",
      title: `${platform} link not available`,
      text: `This business has not provided a ${platform} link.`,
      confirmButtonText: "OK",
    });
  };

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

  const matchedPlans = planData?.filter(
    (plan) =>
      plan?.businessId?.businessDetails?.businessName ===
      businesses?.businessDetails?.businessName
  );
  const capitalizeWords = (str) => {
    return str
      ?.toLowerCase()
      ?.split(" ")
      ?.map((word) => word?.charAt(0).toUpperCase() + word?.slice(1))
      .join(" ");
  };
  const totalRating = businesses?.reviews?.reduce(
    (acc, r) => acc + r?.rating,
    0
  );
  const avgRating = totalRating / businesses?.reviews?.length || [0];
  return (
    <>
      <ToastContainer />
      <div className="container mt-4">
        <div className="row">
          <div className="back-sec">
            <button className="black-btn " onClick={() => router.back()}>
              <i className="bi bi-arrow-left-short"></i> Back
            </button>
            {/* {renderStatusBadge(businesses?.verified)} */}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="details-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  // alignItems: "center",
                }}
              >
                <div>
                  <div>
                    <h5 className="m-0">
                      {capitalizeWords(
                        businesses?.businessDetails?.businessName
                      )}
                    </h5>
                  </div>

                </div>
                <div>
                  {matchedPlans?.length > 0 && (
                    <div className="d-flex gap-2 align-items-center mb-1">
                      {(businesses?.trust === "Approved" ||
                        businesses?.trust === true) && (
                          <button className="premium-listing-trust">
                            Trusted <i className="bi bi-shield-check"></i>
                          </button>
                        )}
                      {(businesses?.verified === "Approved" ||
                        businesses?.verified === true) && (
                          <button className="premium-listing-verified">
                            Verified <i className="bi bi-check2-all"></i>
                          </button>
                        )}
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2 align-items-center mb-1 flex-wrap">
                {/* Rating Section - Never Breaks */}
                <p
                  style={{
                    whiteSpace: "nowrap",
                    margin: 0,
                  }}
                >
                  {`(${avgRating})`}
                  {avgRating >= 1 &&
                    [...Array(Math.floor(avgRating))]?.map((_, i) => (
                      <i key={i} className="bi bi-star-fill"></i>
                    ))}
                  {businesses?.reviews?.length > 0 &&
                    `(${businesses?.reviews?.length})`}
                </p>

                {/* Category Section - Limited to 25 words */}
                {(() => {
                  const categoryName = businesses?.businessCategory?.category?.name || "";
                  const words = categoryName.split(" ");
                  const shortName = words.slice(0, 25).join(" ");
                  return (
                    <p style={{ margin: 0, wordBreak: "break-word" }}>
                      {shortName}
                      {words.length > 25 && " ..."}
                    </p>
                  );
                })()}
              </div>


              <img
                src={businesses?.businessCategory?.businessImages[0]}
                alt="Business Image"
                className="business-detail-image mb-3"
              />
              <div className="basic-li-detail d-flex flex-wrap mb-2 gap-2">
                {businesses?.upgradeListing?.direction?.length > 0 ? (
                  <Link
                    href={`${businesses?.upgradeListing?.direction}`}
                    onClick={() => handleCountClick("direction")}
                    className="business-listing-black-btn"
                  >
                    <i className="bi bi-crosshair"></i> Direction
                  </Link>
                ) : (
                  <Link
                    href={`#`}
                    onClick={() => handleIcone("Direction")}
                    className="business-listing-black-btn"
                  >
                    <i className="bi bi-crosshair"></i> Direction
                  </Link>
                )}
                {/* 
                <Link
                  href={"#"}
                  onClick={() => handleCountClick('share')}
                  className="business-listing-black-btn"
                >
                  <i className="bi bi-share"></i> Share
                </Link> */}
                <button
                  onClick={handleShare}
                  className="business-listing-black-btn"
                >
                  <i className="bi bi-share"></i> Share
                </button>

                {businesses?.contactPerson?.contactNumber?.length > 0 ? (
                  <Link
                    href={`tel:+91${businesses?.contactPerson?.contactNumber}`}
                    onClick={() => handleCountClick("contact")}
                    className="business-listing-black-btn"
                  >
                    <i className="bi bi-telephone-outbound"></i> Contact
                  </Link>
                ) : (
                  <Link
                    href={`#`}
                    onClick={() => handleIcone("Contact")}
                    className="business-listing-black-btn"
                  >
                    <i className="bi bi-telephone-outbound"></i> Contact
                  </Link>
                )}

                {businesses?.upgradeListing?.website?.length > 0 ? (
                  <Link
                    href={`${businesses?.upgradeListing?.website}`}
                    onClick={() => handleCountClick("website")}
                    className="business-listing-black-btn"
                  >
                    <i className="bi bi-globe"></i> Website
                  </Link>
                ) : (
                  <Link
                    href={`#`}
                    onClick={() => handleIcone("Website")}
                    className="business-listing-black-btn"
                  >
                    <i className="bi bi-globe"></i> Website
                  </Link>
                )}

                {businesses.contactPerson?.whatsappNumber?.length > 0 ? (
                  <Link
                    onClick={() => handleCountClick("whatsapp")}
                    href={`https://wa.me/${businesses.contactPerson?.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="business-listing-black-btn"
                  >
                    <i className="bi bi-whatsapp"></i> Whatsapp
                  </Link>
                ) : (
                  <Link
                    href={`#`}
                    onClick={() => handleIcone("Whatsapp")}
                    className="business-listing-black-btn"
                  >
                    <i className="bi bi-whatsapp"></i> Whatsapp
                  </Link>
                )}
              </div>

              <div className="d-flex gap-2 align-items-center mb-1">
                <p>
                  {businesses?.businessDetails?.yib || "0.6"} years in business
                </p>
                <span>|</span>
                <p> {
                  businesses?.businessDetails?.city +
                  " " +
                  businesses?.businessDetails?.state}</p>
              </div>
              {/* End of copied data */}
              <ul className="nav nav-tabs mt-">
                <li className="nav-item">
                  <button
                    className={`nav-link listing-tabs-btn ${activeTab === "overview" ? "active" : ""
                      }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "service" ? "active" : ""
                      }`}
                    onClick={() => setActiveTab("service")}
                  >
                    Service
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "review" ? "active" : ""
                      }`}
                    onClick={() => setActiveTab("review")}
                  >
                    Review
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "photos" ? "active" : ""
                      }`}
                    onClick={() => setActiveTab("photos")}
                  >
                    Photos
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "social" ? "active" : ""
                      }`}
                    onClick={() => setActiveTab("social")}
                  >
                    Social Media
                  </button>
                </li>
              </ul>

              <div className="tab-content mt-3">
                <div
                  className={`tab-pane fade ${activeTab === "overview" ? "show active" : ""
                    }`}
                >
                  <div>
                    <p>
                      <b>About Us: </b>
                      {expanded
                        ? aboutText
                        : words.slice(0, wordLimit).join(" ") +
                        (isLongText ? "..." : "")}

                      {isLongText && (
                        <button
                          onClick={toggleText}
                          style={{
                            border: "none",
                            background: "none",
                            color: "blue",
                            cursor: "pointer",
                            paddingLeft: "5px",
                          }}
                        >
                          {expanded ? "read less" : "read more"}{" "}
                          <i className="bi bi-arrow-right-circle"></i>
                        </button>
                      )}
                    </p>
                  </div>

                  <hr />

                  <div>
                    <p>
                      <b>Address : </b>
                      {businesses?.businessDetails?.building +
                        " " +
                        // businesses?.businessDetails?.area + " " +
                        businesses?.businessDetails?.landmark +
                        " " +
                        businesses?.businessDetails?.city +
                        " " +
                        businesses?.businessDetails?.state +
                        " " +
                        businesses?.businessDetails?.pinCode}
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <div className="opening-hours-container">
                      <p
                        onClick={() => setShowAllHours(!showAllHours)}
                        className={`status ${isOpen ? "open" : "closed"}`}
                      >
                        <b className="text-dark">Working Day: </b>
                        {isOpen ? "Today Timing" : "Closed"}{" "}
                        <i
                          className={`bi ${showAllHours ? "bi-chevron-up" : "bi-chevron-down"
                            }`}
                        ></i>
                      </p>

                      {showAllHours && (
                        <ul className="opening-hours-list">
                          {businesses?.businessTiming?.map((item, index) => (
                            <li
                              key={index}
                              className={index === getCurrentDay() ? "today" : ""}
                            >
                              <span>{item?.day}:</span>{" "}
                              <span>
                                {item?.openTime
                                  ? `${item?.openTime} ${item?.openPeriod} - ${item?.closeTime} ${item?.closePeriod}`
                                  : "Closed"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div>
                    <p>
                      <b>Phone: </b> {businesses?.contactPerson?.contactNumber}
                    </p>
                  </div>
                  <hr />
                  <div className="tab-pane">
                    <p>
                      <b>Services</b>
                    </p>
                    <ul className="service-list list-unstyled">
                      {businesses?.businessCategory?.keywords?.map(
                        (service, index) => (
                          <li key={index}>
                            <i className="bi bi-check2-all me-2"></i>
                            {capitalizeWords(
                              service.charAt(0).toUpperCase() + service.slice(1)
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <hr />
                  <div className="tab-pane">
                    <p>
                      <b>Servicing Area</b>
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      {businesses?.businessCategory?.serviceArea?.map(
                        (servicesArea, index) => (
                          <p key={index}>
                            {servicesArea}{" "}
                            {index !== servicesArea?.length - 1 && (
                              <span className="mx-1 text-muted">|</span>
                            )}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className="tab-pane">
                    <h4>Photos</h4>
                    <div className="photo-gallery d-flex flex-wrap gap-2">
                      {businesses?.businessCategory?.businessImages?.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="gallery-img"
                          onClick={() => openLightbox(index)}
                        />
                      )
                      )}
                      {!showAll &&
                        businesses?.businessCategory?.businessImages?.length >
                        4 && (
                          <div
                            className="plus-overlay"
                            onClick={() => setShowAll(true)}
                          >
                            +
                            {businesses?.businessCategory?.businessImages
                              ?.length - 4}
                          </div>
                        )}
                    </div>
                  </div>
                  {businesses?.faq?.length > 0 && (
                    <>
                      <hr />
                      <div className="tab-pane">
                        <ListingPageFaq faq={businesses?.faq} />
                      </div>
                    </>
                  )}

                  <hr />
                  <div className="tab-pane">
                    <p>
                      <b>Rating Review</b>
                    </p>
                    <ul className="review-list">
                      {businesses?.reviews?.map((review, index) => (
                        <li key={index} style={{ width: "100%" }}>
                          <div
                            style={{
                              width: "10%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "green",
                                color: "white",
                              }}
                            >
                              {typeof review.author === "string" &&
                                review.author.length > 0
                                ? review.author.charAt(0)
                                : "?"}
                            </span>
                          </div>
                          <div style={{ width: "90%" }}>
                            <div className="review-comment-star">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={
                                    i < review?.rating
                                      ? "bi bi-star-fill"
                                      : "bi bi-star"
                                  }
                                ></i>
                              ))}
                            </div>
                            <p className="client-feedback">
                              {`"${review?.comment || ""}"`}
                            </p>
                          </div>
                        </li>
                      ))}

                      <div className="text-center">
                        <button
                          className="login-btn mb-2"
                          onClick={() => setShowForm(!showForm)}
                        >
                          {showForm ? "Hide Review Form" : "Write a Review"}{" "}
                          <i className="bi bi-pencil"></i>
                        </button>

                        {showForm && (
                          <div className="card border-0 text-start p-4 mb-4 bg-white">
                            <h4 className="text-center fw-bold text-primary mb-3">
                              <i className="bi bi-chat-dots-fill me-2"></i>Leave
                              a Review
                            </h4>
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                <i className="bi bi-star-fill me-2 "></i>Give
                                Rating
                              </label>
                              <div className="d-flex gap-2 fs-4">
                                {[...Array(5)].map((_, i) => (
                                  <i
                                    key={i}
                                    className={`bi ${i < newReview.rating
                                      ? "bi-star-fill "
                                      : "bi-star text-muted"
                                      }`}
                                    style={{
                                      cursor: "pointer",
                                      transition: "transform 0.2s ease",
                                    }}
                                    onClick={() =>
                                      setNewReview({
                                        ...newReview,
                                        rating: i + 1,
                                      })
                                    }
                                    onMouseOver={(e) =>
                                    (e.currentTarget.style.transform =
                                      "scale(1.3)")
                                    }
                                    onMouseOut={(e) =>
                                    (e.currentTarget.style.transform =
                                      "scale(1)")
                                    }
                                  ></i>
                                ))}
                              </div>
                            </div>

                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                <i className="bi bi-person-circle me-2"></i>Your
                                Name
                              </label>
                              <input
                                type="text"
                                className="form-control rounded-pill px-4 py-2"
                                placeholder="Enter your name"
                                value={newReview?.author}
                                onChange={(e) =>
                                  setNewReview({
                                    ...newReview,
                                    author: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                <i className="bi bi-chat-left-text-fill me-2"></i>
                                Your Comment
                              </label>
                              <textarea
                                className="form-control rounded-4 px-4 py-2"
                                rows="4"
                                placeholder="Write something nice..."
                                value={newReview?.comment}
                                onChange={(e) =>
                                  setNewReview({
                                    ...newReview,
                                    comment: e.target.value,
                                  })
                                }
                              ></textarea>
                            </div>

                            <div className="text-center">
                              <button
                                className="btn btn-outline-primary px-4 py-2 rounded-pill mt-3"
                                onClick={handleAddReview}
                              >
                                <i className="bi bi-send-fill me-2"></i>Submit
                                Review
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </ul>
                  </div>
                  <hr />
                  <div className="tab-pane">
                    <h4>Social Media</h4>
                    <div className="socialmedia-details">
                      <div>
                        <div className="social-icons">
                          {businesses?.upgradeListing?.twitter.length > 0 ? (
                            <Link
                              href={`${businesses?.upgradeListing?.twitter}`}
                            >
                              <i className="bi bi-twitter"></i>
                            </Link>
                          ) : (
                            <Link
                              href={`#`}
                              onClick={() => handleIcone("Twitter")}
                            >
                              <i className="bi bi-twitter"></i>
                            </Link>
                          )}

                          {businesses?.upgradeListing?.facebook.length > 0 ? (
                            <Link
                              href={`${businesses?.upgradeListing?.facebook}`}
                            >
                              <i className="bi bi-facebook"></i>
                            </Link>
                          ) : (
                            <Link
                              href={`#`}
                              onClick={() => handleIcone("Facebook")}
                            >
                              <i className="bi bi-facebook"></i>
                            </Link>
                          )}

                          {businesses?.upgradeListing?.linkedin.length > 0 ? (
                            <Link
                              href={`${businesses?.upgradeListing?.linkedin}`}
                            >
                              <i className="bi bi-linkedin"></i>
                            </Link>
                          ) : (
                            <Link
                              href={`#`}
                              onClick={() => handleIcone("Linkedin")}
                            >
                              <i className="bi bi-linkedin"></i>
                            </Link>
                          )}

                          {businesses?.upgradeListing?.instagram.length > 0 ? (
                            <Link
                              href={`${businesses?.upgradeListing?.instagram}`}
                            >
                              <i className="bi bi-instagram"></i>
                            </Link>
                          ) : (
                            <Link
                              href={`#`}
                              onClick={() => handleIcone("Instagram")}
                            >
                              <i className="bi bi-instagram"></i>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`tab-pane fade ${activeTab === "service" ? "show active" : ""
                    }`}
                >
                  <ul className="service-list list-unstyled">
                    {businesses?.businessCategory?.keywords?.map(
                      (service, index) => (
                        <li key={index}>
                          <i className="bi bi-check2-all me-2"></i>
                          {service.charAt(0).toUpperCase() + service.slice(1)}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "review" ? "show active" : ""
                    }`}
                >
                  <p>
                    <b>Review Rating</b>
                  </p>
                  <ul className="review-list">
                    {businesses?.reviews?.map((review, index) => (
                      <li key={index}>
                        <span className="review-name">
                          {typeof review.author === "string" &&
                            review.author.length > 0
                            ? review.author.charAt(0)
                            : "?"}
                        </span>
                        <div>
                          <div className="review-comment-star">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={
                                  i < review?.rating
                                    ? "bi bi-star-fill"
                                    : "bi bi-star"
                                }
                              ></i>
                            ))}
                          </div>
                          <p className="client-feedback">
                            {`"${review?.comment || ""}"`}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="text-center">
                    <button
                      className="login-btn mb-2"
                      onClick={() => setShowForm(!showForm)}
                    >
                      {showForm ? "Hide Review Form" : "Write a Review"}{" "}
                      <i className="bi bi-pencil"></i>
                    </button>

                    {showForm && (
                      <div className="add-review">
                        <h4>Add a Review</h4>
                        <div className="rating-selection">
                          <p>
                            <b>Select Rating:</b>
                          </p>
                          <div>
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={
                                  i < newReview.rating
                                    ? "bi bi-star-fill"
                                    : "bi bi-star"
                                }
                                onClick={() =>
                                  setNewReview({ ...newReview, rating: i + 1 })
                                }
                                style={{ cursor: "pointer" }}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Your Name"
                          className="login-input mb-2"
                          value={newReview.author}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              author: e.target.value,
                            })
                          }
                        />
                        <textarea
                          placeholder="Your Comment"
                          className="login-input mb-2"
                          value={newReview.comment}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              comment: e.target.value,
                            })
                          }
                        ></textarea>

                        <button
                          className="btn btn-primary"
                          onClick={handleAddReview}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`tab-pane fade ${activeTab === "photos" ? "show active" : ""
                    }`}
                >
                  <h4>Photos</h4>
                  <div className="photo-gallery d-flex flex-wrap gap-2">
                    {businesses?.businessCategory?.businessImages?.map(
                      (photo, index) => (
                        <Image
                          priority
                          key={index}
                          src={photo}
                          width={200}
                          height={200}
                          alt={`Photo ${index + 1}`}
                          className="gallery-img"
                          onClick={() => openLightbox(index)}
                        />
                      )
                    )}
                    {!showAll &&
                      businesses?.businessCategory?.businessImages.length >
                      4 && (
                        <div
                          className="plus-overlay"
                          onClick={() => setShowAll(true)}
                        >
                          +
                          {businesses?.businessCategory?.businessImages
                            ?.length - 4}
                        </div>
                      )}
                  </div>
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "social" ? "show active" : ""
                    }`}
                >
                  <h4>Social Media</h4>
                  <div className="socialmedia-details">
                    <div>
                      {/* <div className="social-icons">
                        <Link href="https://x.com/biziffy_india">
                          <i className="bi bi-twitter"></i>
                        </Link>
                        <Link href="https://www.facebook.com/people/Biziffy-India/pfbid05EeMQK7qXrw5nuEe2B6cKNhBwYTskFwsMrijTM1WdgijuLjvuXUa7GQ94WJM9AEvl/">
                          <i className="bi bi-facebook"></i>
                        </Link>
                        <Link href="#">
                          <i className="bi bi-linkedin"></i>
                        </Link>
                        <Link href="https://www.instagram.com/biziffyindia/">
                          <i className="bi bi-instagram"></i>
                        </Link>
                      </div> */}
                      <div className="social-icons">
                        {businesses?.upgradeListing?.twitter.length > 0 ? (
                          <Link href={`${businesses?.upgradeListing?.twitter}`}>
                            <i className="bi bi-twitter"></i>
                          </Link>
                        ) : (
                          <Link
                            href={`#`}
                            onClick={() => handleIcone("Twitter")}
                          >
                            <i className="bi bi-twitter"></i>
                          </Link>
                        )}

                        {businesses?.upgradeListing?.facebook.length > 0 ? (
                          <Link
                            href={`${businesses?.upgradeListing?.facebook}`}
                          >
                            <i className="bi bi-facebook"></i>
                          </Link>
                        ) : (
                          <Link
                            href={`#`}
                            onClick={() => handleIcone("Facebook")}
                          >
                            <i className="bi bi-facebook"></i>
                          </Link>
                        )}

                        {businesses?.upgradeListing?.linkedin.length > 0 ? (
                          <Link
                            href={`${businesses?.upgradeListing?.linkedin}`}
                          >
                            <i className="bi bi-linkedin"></i>
                          </Link>
                        ) : (
                          <Link
                            href={`#`}
                            onClick={() => handleIcone("Linkedin")}
                          >
                            <i className="bi bi-linkedin"></i>
                          </Link>
                        )}

                        {businesses?.upgradeListing?.instagram.length > 0 ? (
                          <Link
                            href={`${businesses?.upgradeListing?.instagram}`}
                          >
                            <i className="bi bi-instagram"></i>
                          </Link>
                        ) : (
                          <Link
                            href={`#`}
                            onClick={() => handleIcone("Instagram")}
                          >
                            <i className="bi bi-instagram"></i>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {lightbox && (
                  <div
                    className="lightbox-overlay fullscreen"
                    onClick={closeLightbox}
                  >
                    <button className="close-btn" onClick={closeLightbox}>
                      &times;
                    </button>
                    <Swiper
                      initialSlide={currentIndex}
                      navigation
                      keyboard={{ enabled: true }}
                      modules={[Navigation, Keyboard]}
                      className="lightbox-slider"
                      onSwiper={(swiper) => swiper.slideTo(currentIndex, 0)}
                    >
                      {businesses?.businessCategory?.businessImages?.map((photo, index) => (
                        <SwiperSlide key={index}>
                          <div className="fullscreen-image-wrapper">
                            <img
                              priority
                              quality={100}
                              src={photo}
                              alt={`Slide ${index}`}
                              className="lightbox-img"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            {/* Enquiry Form */}
            <form className="enquiry-form">
              <div className="enquiry-heading d-flex align-items-center justify-content-center mb-3">
                <i className="bi bi-bell-fill enquiry-icon me-2"></i>
                <h5 className="mb-0">Enquiry Form</h5>
              </div>

              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Enter your name"
                  value={enquiryForm.name}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, name: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="login-input"
                  placeholder="Enter phone number"
                  value={enquiryForm.phone}
                  maxLength={10}
                  pattern="\d{10}"
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    if (onlyNums.length <= 10) {
                      setEnquiryForm({ ...enquiryForm, phone: onlyNums });
                    }
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  What are you Looking for...
                </label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Write your requirement"
                  value={enquiryForm.requirement}
                  onChange={(e) =>
                    setEnquiryForm({
                      ...enquiryForm,
                      requirement: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="button"
                onClick={handleEnquiryForm}
                className="btn bg-dark text-white w-100"
              >
                Get Best Deal <i className="bi bi-chevron-double-right"></i>
              </button>
            </form>

            {/* add section  */}
            {filter?.map((ad, index) => {
              return (
                <section key={index} className="ads-section my-3">
                  <div className="d-flex justify-content-center align-item-center">
                    <Image
                      priority
                      src={ad?.image}
                      alt="ads"
                      className="img-fluid"
                      width={500}
                      height={500}
                    />
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>

      <div className="contain">
        <div className="row">
          <BusinessSimilarListing
            category={businesses?.businessCategory?.category?.name}
            id={businesses?._id}
          />
        </div>
      </div>
    </>
  );
};

export default Businesslistingdetails;
