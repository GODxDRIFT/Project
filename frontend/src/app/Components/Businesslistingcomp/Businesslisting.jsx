"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "../../pages/bussiness-listing/businessListing.css";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
// import PaidListing from "../paid-listing/PaidListing"
import PaidListing from "../../pages/paid-listing/PaidListing";
import { getData, postData } from "../../services/FetchNodeServices";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toast } from "react-toastify";

let slugify = (text = "") => text.toLowerCase().trim().replace(/,/g, "--").replace(/&/g, "and").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");


const Businesslisting = () => {
  const router = useRouter();
  const path = usePathname();
  const [query, setQuery] = useState("");
  const [pincode, setPincode] = useState("");
  const [title, setTitle] = useState("");
  const [state, setState] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const [businesses, setBusinesses] = useState([]);
  const [websiteList, setWebsiteList] = useState([]);
  const [tocken, setToken] = useState("");
  const [user, setUser] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [advertisements, setAdvertisements] = useState([]);
  const [bottomAdvertisements, setBottomAdvertisements] = useState([]);
  const [centerAdvertisements, setCenterAdvertisements] = useState([]);
  const [planData, setPlanData] = useState([]);
  const page = 1;
  const limit = 10;

  const fetchAdvartisMant = async () => {
    try {
      const response = await getData("advertisements/get-all-advertisements");
      const BottumactiveAds =
        response?.filter(
          (ad) => ad?.status === "Active" && ad.type === "Bottom"
        ) || [];
      const activeAds =
        response?.filter(
          (ad) => ad?.status === "Active" && ad.type === "Top"
        ) || [];
      const centerAds =
        response?.filter(
          (ad) => ad?.status === "Active" && ad.type === "Center"
        ) || [];
      setAdvertisements(activeAds);
      setBottomAdvertisements(BottumactiveAds);
      setCenterAdvertisements(centerAds);
    } catch (error) {
      console.error("Failed to fetch advertisements:", error);
      setAdvertisements([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("biziffyToken");
    const user = localStorage.getItem("biziffyUser");
    setToken(token);
    setUser(JSON.parse(user)?._id);
    fetchAdvartisMant();
    fetchPlanData();
  }, []);

  const formatSlugs = (slug) => {
    if (!slug) return "";
    return slug
      .replace(/-and-/g, " & ")
      .replace(/--/g, ",")
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const parts = path?.split("/") || [];

    setPincode(formatSlugs(parts[3]));
    setState(formatSlugs(parts[4]));
    setQuery(formatSlugs(parts[5]));
    if (parts.length > 6) {
      setTitle(formatSlugs(parts[6]));
    }
  }, []);

  const handleToggleView = () => {
    if (visibleCount >= businesses.length) {
      setVisibleCount(4); // Reset
    } else {
      setVisibleCount((prev) => prev + 4);
    }
  };

  const fetchBusinessesListing = useCallback(async () => {
    try {
      let response;
      const body = { pincode, query, title, state, page, limit, };
      if (pincode || query) {
        response = await postData("search-listings", body);
      }
      setBusinesses(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    }
  }, [pincode, query, title, state]);

  const fetchWebsiteListing = useCallback(async () => {
    try {
      let response;
      const body = { pincode, query, title, state, page, limit, };
      if (pincode || query) {
        response = await postData("admin/search-website-listings", body);
      }
      if (response?.status) {
        setWebsiteList(response?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    }
  }, [pincode, query, title, state]);


  useEffect(() => {
    fetchBusinessesListing();
    fetchWebsiteListing();
  }, [fetchBusinessesListing, fetchWebsiteListing, pincode, query]);

  const handleCountClick = (type, businessId) => {
    if (!businessId || !type) return;
    // alert("HHHH", businessId, type)
    const key = `business_click_${businessId}_${type}`;
    const lastClickDay = localStorage.getItem(key);
    const now = Date.now();
    const currentDay = Math.floor(now / 86400000);

    if (!lastClickDay || parseInt(lastClickDay) < currentDay) {
      postData(`admin/increase-click-count/${businessId}`, { type, user })
        .then(() => {
          localStorage.setItem(key, currentDay.toString());
        })
        .catch((err) => {
          console.error("Error increasing count", err);
        });
    } else {
    }
  };

  const fetchPlanData = async (userId) => {
    // JSON.parse(user)?._id
    try {
      const response = await getData(`membership/get-all-memberships`);
      if (response?.status === true) {
        setPlanData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching plan data:", error);
    }
  };

  const matchedBusinesses = planData
    ?.map(
      (plan) =>
        businesses?.find(
          (item) =>
            item?.businessDetails?.businessName ===
            plan?.businessId?.businessDetails?.businessName
        ) && {
          business: businesses?.find(
            (item) =>
              item?.businessDetails?.businessName ===
              plan?.businessId?.businessDetails?.businessName
          ),
          planName: plan?.planDetails?.name || "",
        }
    )
    .filter(Boolean)
    .sort((a, b) => {
      const priority = { Premium: 1, Standard: 2, Free: 3 };
      return (priority[a.planName] || 99) - (priority[b.planName] || 99);
    })
    .map((item) => item.business);

  const unmatchedBusinesses = businesses?.filter(
    (item) =>
      !planData?.some(
        (plan) =>
          item?.businessDetails?.businessName ===
          plan?.businessId?.businessDetails?.businessName
      )
  );

  const visibleBusinesses1 = unmatchedBusinesses.slice(0, visibleCount);
  const visibleBusinesses2 = matchedBusinesses.slice(0, visibleCount);
  const capitalizeWords = (str) => {
    return str
      ?.toLowerCase()
      ?.split(" ")
      ?.map((word) => word?.charAt(0).toUpperCase() + word?.slice(1))
      .join(" ");
  };
  // setFilterAdvertisements(advertisements?.filter((ad) => ad.categoryName === query || ad.subCategoryName === query))

  const filteredTopAdvertisements = advertisements.filter(
    (ad) => ad?.categoryName === query || ad?.subCategoryName === query
  );
  const filteredBottomAdvertisements = bottomAdvertisements.filter(
    (ad) => ad?.categoryName === query || ad?.subCategoryName === query
  );
  const filteredCenterAdvertisements = centerAdvertisements.filter(
    (ad) => ad?.categoryName === query || ad?.subCategoryName === query
  );
  return (
    <>
      <section className="business-listing-page">
        {/* Banner Section */}
        <div className="container">
          <div className="listing-banner">
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              slidesPerView={1}
            >
              {advertisements?.map((img, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="listing-banner-maiin"
                    style={{
                      
                    }}
                  >
                    <Image
                      src={img?.image}
                      alt={`Banner ${index + 1}`}
                      fill
                      priority
                      quality={100}
                      style={{
                        objectFit: "fill",
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
        </div>

        {/* Business Listings */}
        <div className="container">
          <div className="business-listing-container">
            <h5 className="text-dark mb-2">
              Find the right business solutions for your goals
            </h5>
            <div className="row">
              {/* Business Cards */}
              <div className="col-md-6">
                <div className="col-5-scroll-css">
                  {matchedBusinesses?.length > 0 &&
                    visibleBusinesses2?.map((biz) => {
                      let isOpen = true;
                      const togglePasswordVisibility = () => {
                        setShowPassword((prev) => !prev);
                      };
                      const handleChange = (e) => {
                        const { name, value, type, checked } = e.target;
                        const updatedValue =
                          type === "checkbox" ? checked : value;
                        setFormData((prev) => ({
                          ...prev,
                          [name]: updatedValue,
                        }));
                        setErrors((prev) => ({ ...prev, [name]: "" }));
                      };

                      const handleCardClick = () => {
                        if (tocken) {
                          localStorage.setItem("biziffyListingId", biz?._id);
                          handleCountClick("listings", biz?._id);
                          window.location.href = `/pages/bussiness-listing/${slugify(biz?.businessDetails?.businessName)}`;
                        } else {
                          const modal = new bootstrap.Modal(
                            document.getElementById("exampleModalToggle")
                          );
                          modal.show();
                        }
                      };

                      const validate = () => {
                        const newErrors = {};
                        const { email, password } = formData;

                        if (!email) {
                          newErrors.email = "Email is required.";
                        } else if (
                          !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
                        ) {
                          newErrors.email = "Invalid email format.";
                        }

                        if (!password) {
                          newErrors.password = "Password is required.";
                        }

                        setErrors(newErrors);
                        return Object.keys(newErrors).length === 0;
                      };

                      const handleSubmit = async (e) => {
                        e.preventDefault();
                        if (!validate()) return;

                        setIsLoading(true);
                        try {
                          const response = await postData("auth/user-login", {
                            email: formData.email,
                            password: formData.password,
                          });
                          if (response?.status) {
                            localStorage.setItem(
                              "biziffyToken",
                              response?.token
                            );
                            localStorage.setItem(
                              "biziffyUser",
                              JSON.stringify(response?.user)
                            );
                            setSuccessMessage(
                              "Login successful! Redirecting..."
                            );
                            setLoginError("");
                            setTimeout(() => {
                              const modalElement =
                                document.getElementById("exampleModalToggle");
                              const modalInstance =
                                bootstrap.Modal.getInstance(modalElement) ||
                                new bootstrap.Modal(modalElement);
                              modalInstance.hide();
                              window.location.reload();
                            }, 1500);
                          } else {
                            setLoginError(
                              data.message || "Something went wrong."
                            );
                            setSuccessMessage("");
                          }
                        } catch (error) {
                          console.error("Login Error:", error);
                          setLoginError("An error occurred while logging in.");
                          setSuccessMessage("");
                        } finally {
                          setIsLoading(false);
                        }
                      };
                      const totalRating = biz?.reviews?.reduce(
                        (acc, r) => acc + r?.rating,
                        0
                      );
                      const avgRating = biz?.reviews?.length
                        ? parseFloat(
                          (totalRating / biz.reviews.length).toFixed(1)
                        )
                        : 0;

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

                      // useEffect(() => {
                      const todayIndex = getCurrentDay();
                      const todayTiming = biz?.businessTiming?.[todayIndex];
                      if (todayTiming?.isOpen === true) {
                        const open = isCurrentlyOpen(
                          todayTiming?.openTime,
                          todayTiming?.openPeriod,
                          todayTiming?.closeTime,
                          todayTiming?.closePeriod
                        );
                        isOpen = true;
                      } else {
                        isOpen = false;
                      }
                      // }, [biz]);

                      return (
                        <div key={biz?._id}>
                          {/* <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1"> */}
                          <div
                            className="modal fade"
                            id="exampleModalToggle"
                            aria-hidden="true"
                            aria-labelledby="exampleModalToggleLabel"
                            tabIndex="-1"
                          >
                            <div className="modal-dialog modal-dialog-centered">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h1
                                    className="modal-title fs-5 text-black"
                                    id="exampleModalToggleLabel"
                                  >
                                    Please Login First
                                  </h1>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body m-auto">
                                  <div className="auth-card m-auto">
                                    <div className="text-center mb-3">
                                      <h4 className="mt-2">Welcome Back!</h4>
                                      <p>Sign in to continue</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                      <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="login-input mb-3"
                                        value={formData.email}
                                        onChange={handleChange}
                                      />
                                      {errors.email && (
                                        <p className="text-danger">
                                          {errors.email}
                                        </p>
                                      )}

                                      <div className="password-input mb-3 position-relative">
                                        <input
                                          type={
                                            showPassword ? "text" : "password"
                                          }
                                          name="password"
                                          placeholder="Password"
                                          className="login-input w-100"
                                          value={formData.password}
                                          onChange={handleChange}
                                        />
                                        <span
                                          className="show-password-btn position-absolute"
                                          style={{
                                            top: "50%",
                                            right: "15px",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                          }}
                                          onClick={togglePasswordVisibility}
                                        >
                                          {showPassword ? (
                                            <i className="bi bi-eye"></i>
                                          ) : (
                                            <i className="bi bi-eye-slash"></i>
                                          )}
                                        </span>
                                      </div>
                                      {errors.password && (
                                        <p className="text-danger">
                                          {errors.password}
                                        </p>
                                      )}

                                      <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="form-check">
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="rememberMe"
                                            name="remember"
                                            checked={formData.remember}
                                            onChange={handleChange}
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor="rememberMe"
                                          >
                                            Remember me
                                          </label>
                                        </div>
                                        <Link
                                          href="/pages/forgot-password"
                                          className="text-decoration-none"
                                        >
                                          Forgot Password?
                                        </Link>
                                      </div>

                                      <button
                                        type="submit"
                                        className="login-btn bg-primary text-white w-100"
                                      >
                                        Login
                                      </button>

                                      {loginError && (
                                        <p className="text-danger text-center mt-3">
                                          {loginError}
                                        </p>
                                      )}
                                      {successMessage && (
                                        <p className="text-success text-center mt-3">
                                          {successMessage}
                                        </p>
                                      )}

                                      <p className="text-center mt-3">
                                        Don’t have an account?{" "}
                                        <Link
                                          href="/pages/signup"
                                          className="text-primary"
                                        >
                                          Register
                                        </Link>
                                      </p>
                                    </form>

                                    {/* Google Login Button */}
                                    <div className="text-center mt-1 w-1/4 mx-auto pt-2 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-all">
                                      <GoogleOAuthProvider clientId="497194151856-8ljsv11npsqu14n38tj38mkoo83m6ies.apps.googleusercontent.com">
                                        <GoogleLogin
                                          onSuccess={async (credentialResponse) => {
                                            const token = credentialResponse.credential;
                                            if (token) {
                                              try {
                                                const res = await postData("auth/google-login", { tokenId: token });
                                                const data = await res;
                                                // console.log("BBBBBB:=>", data);
                                                if (res?.success === true) {
                                                  toast.success("Google login successful!");
                                                  localStorage.setItem("biziffyToken", res?.token);
                                                  localStorage.setItem("biziffyUser", JSON.stringify(res?.user));
                                                  setSuccessMessage("Login successful! Redirecting...");
                                                  setLoginError("");
                                                  setTimeout(() => {
                                                    const modalElement = document.getElementById("exampleModalToggle");
                                                    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                                                    modalInstance.hide();
                                                    window.location.reload();
                                                  }, 1000);
                                                } else {
                                                  toast.success(res?.message || "Google login failed.");
                                                  setLoginError(data.message || "Google login failed.");
                                                }
                                              } catch (error) {
                                                console.error("Google Login Error:", error);
                                                setLoginError("Something went wrong with Google login.");
                                              }
                                            }
                                          }}
                                          onError={() => {
                                            setLoginError("Google login failed. Please try again.");
                                          }}
                                        />
                                      </GoogleOAuthProvider>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="modal-footer">
                                <button className="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">{isLoading ? "Login..." : "Login"}</button>
                              </div> */}
                              </div>
                            </div>
                          </div>

                          <div
                            className="business-card"
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "20px",
                            }}
                            onClick={handleCardClick}>
                            <div>
                              <Image
                                src={
                                  biz?.businessCategory?.businessImages?.[0] ||
                                  null
                                }
                                alt={biz?.name || "Business"}
                                className="listing-image"
                                width={300}
                                height={300}
                                priority
                              />
                            </div>
                            <div style={{ width: "100%" }}>
                              <div className="title-and-trusted-section">
                                <h5>
                                  {capitalizeWords(
                                    biz?.businessDetails?.businessName?.length >
                                      45
                                      ? biz.businessDetails.businessName.slice(
                                        0,
                                        20
                                      ) + "..."
                                      : biz.businessDetails.businessName
                                  )}
                                </h5>
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
                              </div>

                              <div className="d-flex gap-2 align-items-center">
                                <p>
                                  {avgRating} {" "}
                                  {[...Array(Math?.floor(avgRating))]?.map(
                                    (_, i) => (
                                      <i
                                        key={i}
                                        className="bi bi-star-fill text-success"
                                        style={{ color: "green" }}
                                      ></i>
                                    )
                                  )}{" "}
                                  (
                                  {biz?.reviews?.length > 0 &&
                                    biz?.reviews?.length}
                                  )
                                </p>
                                <p>
                                  {capitalizeWords(
                                    biz?.businessCategory?.category?.name
                                  )}
                                </p>
                              </div>

                              <div className="d-flex gap-2 align-items-center">
                                <p>
                                  {biz?.businessDetails?.yib || "0.6"} years in
                                  business
                                </p>
                                {/* <span>|</span> */}
                                <p>
                                  {biz?.businessDetails?.city},{" "}
                                  {biz?.businessDetails?.state}
                                </p>
                              </div>

                              <div className="d-flex gap-2 align-items-center">
                                <div className="opening-hours-container">
                                  <p
                                    className={`status ${isOpen ? "Today Timing" : "closed"
                                      }`}
                                  >
                                    {isOpen ? "Today Timing" : "Closed Now"}
                                  </p>
                                </div>
                                {/* <span>|</span> */}
                                <p>
                                  Mobile: {biz?.contactPerson?.contactNumber}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {filteredCenterAdvertisements?.length > 0 && (
                    <div
                      className="business-card"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "20px",
                      }}
                    >
                      <Swiper
                        modules={[Autoplay]}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                        slidesPerView={1}
                      >
                        {filteredCenterAdvertisements?.map((img, index) => (
                          <SwiperSlide key={index}>
                            <Image
                              src={img?.image}
                              alt={`Banner ${index + 1}`}
                              className="business-listing-image"
                              width={800}
                              height={150}
                              quality={100}
                              priority
                              objectFit="cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}

                  {visibleBusinesses1?.map((biz) => {
                    let isOpen = true;
                    const togglePasswordVisibility = () => {
                      setShowPassword((prev) => !prev);
                    };
                    const handleChange = (e) => {
                      const { name, value, type, checked } = e.target;
                      const updatedValue =
                        type === "checkbox" ? checked : value;

                      setFormData((prev) => ({
                        ...prev,
                        [name]: updatedValue,
                      }));
                      setErrors((prev) => ({ ...prev, [name]: "" }));
                    };

                    const handleCardClick = () => {
                      if (tocken) {
                        localStorage.setItem("biziffyListingId", biz?._id);
                        handleCountClick("listings", biz?._id);
                        window.location.href = `/pages/bussiness-listing/${slugify(biz?.businessDetails?.businessName)}`;
                      } else {
                        const modal = new bootstrap.Modal(
                          document.getElementById("exampleModalToggle")
                        );
                        modal.show();
                      }
                    };

                    const validate = () => {
                      const newErrors = {};
                      const { email, password } = formData;

                      if (!email) {
                        newErrors.email = "Email is required.";
                      } else if (
                        !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
                      ) {
                        newErrors.email = "Invalid email format.";
                      }

                      if (!password) {
                        newErrors.password = "Password is required.";
                      }

                      setErrors(newErrors);
                      return Object.keys(newErrors).length === 0;
                    };

                    const handleRegister = () => {
                      const modalElement =
                        document.getElementById("exampleModalToggle");
                      if (modalElement) {
                        const modalInstance =
                          bootstrap.Modal.getInstance(modalElement) ||
                          new bootstrap.Modal(modalElement);
                        modalInstance.hide();
                      }

                      setTimeout(() => {
                        router.push("/pages/signup");
                      }, 300);
                    };

                    const handleSubmit = async (e) => {
                      e.preventDefault();

                      if (!validate()) return;

                      setIsLoading(true);
                      try {
                        const response = await postData("auth/user-login", {
                          email: formData.email,
                          password: formData.password,
                        });
                        if (response?.status) {
                          localStorage.setItem("biziffyToken", response?.token);
                          localStorage.setItem(
                            "biziffyUser",
                            JSON.stringify(response?.user)
                          );
                          setSuccessMessage("Login successful! Redirecting...");
                          setLoginError("");
                          setTimeout(() => {
                            const modalElement =
                              document.getElementById("exampleModalToggle");
                            const modalInstance =
                              bootstrap.Modal.getInstance(modalElement) ||
                              new bootstrap.Modal(modalElement);
                            modalInstance.hide();
                            window.location.reload();
                          }, 1500);
                        } else {
                          setLoginError(
                            data.message || "Something went wrong."
                          );
                          setSuccessMessage("");
                        }
                      } catch (error) {
                        console.error("Login Error:", error);
                        setLoginError("An error occurred while logging in.");
                        setSuccessMessage("");
                      } finally {
                        setIsLoading(false);
                      }
                    };

                    const totalRating = biz?.reviews?.reduce(
                      (acc, r) => acc + r?.rating,
                      0
                    );
                    const avgRating = biz?.reviews?.length
                      ? parseFloat(
                        (totalRating / biz.reviews.length).toFixed(1)
                      )
                      : 0;
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

                    // useEffect(() => {
                    const todayIndex = getCurrentDay();
                    const todayTiming = biz?.businessTiming?.[todayIndex];
                    if (todayTiming?.isOpen === true) {
                      const open = isCurrentlyOpen(
                        todayTiming?.openTime,
                        todayTiming?.openPeriod,
                        todayTiming?.closeTime,
                        todayTiming?.closePeriod
                      );
                      isOpen = true;
                    } else {
                      isOpen = false;
                    }
                    // }, [biz]);

                    return (
                      <div key={biz?._id}>
                        <div
                          className="modal fade"
                          id="exampleModalToggle"
                          aria-hidden="true"
                          aria-labelledby="exampleModalToggleLabel"
                          tabIndex="-1"
                        >
                          <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1
                                  className="modal-title fs-5 text-black"
                                  id="exampleModalToggleLabel"
                                >
                                  Please Login First
                                </h1>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div className="modal-body d-flex justify-content-center">
                                <div
                                  className="auth-card"
                                  style={{ margin: "auto" }}
                                >
                                  <div className="text-center mb-3">
                                    <h4 className="mt-2">Welcome Back!</h4>
                                    <p>Sign in to continue</p>
                                  </div>

                                  <form onSubmit={handleSubmit}>
                                    <input
                                      type="email"
                                      name="email"
                                      placeholder="Email"
                                      className="login-input mb-3"
                                      value={formData.email}
                                      onChange={handleChange}
                                    />
                                    {errors.email && (
                                      <p className="text-danger">
                                        {errors.email}
                                      </p>
                                    )}

                                    <div className="password-input mb-3 position-relative">
                                      <input
                                        type={
                                          showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        placeholder="Password"
                                        className="login-input w-100"
                                        value={formData.password}
                                        onChange={handleChange}
                                      />
                                      <span
                                        className="show-password-btn position-absolute"
                                        style={{
                                          top: "50%",
                                          right: "15px",
                                          transform: "translateY(-50%)",
                                          cursor: "pointer",
                                        }}
                                        onClick={togglePasswordVisibility}
                                      >
                                        {showPassword ? (
                                          <i className="bi bi-eye"></i>
                                        ) : (
                                          <i className="bi bi-eye-slash"></i>
                                        )}
                                      </span>
                                    </div>
                                    {errors.password && (
                                      <p className="text-danger">
                                        {errors.password}
                                      </p>
                                    )}

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <div className="form-check">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          id="rememberMe"
                                          name="remember"
                                          checked={formData.remember}
                                          onChange={handleChange}
                                        />
                                        <label
                                          className="form-check-label text-black"
                                          htmlFor="rememberMe"
                                        >
                                          Remember me
                                        </label>
                                      </div>
                                      <Link
                                        href="/pages/forgot-password"
                                        className="text-decoration-none"
                                      >
                                        Forgot Password?
                                      </Link>
                                    </div>

                                    <button
                                      type="submit"
                                      className="login-btn bg-primary text-white w-100"
                                    >
                                      Login
                                    </button>

                                    {loginError && (
                                      <p className="text-danger text-center mt-3">
                                        {loginError}
                                      </p>
                                    )}
                                    {successMessage && (
                                      <p className="text-success text-center mt-3">
                                        {successMessage}
                                      </p>
                                    )}

                                    <p className="text-center mt-3">
                                      Don’t have an account?{" "}
                                      <span
                                        style={{
                                          color: "#0000FF",
                                          cursor: "pointer",
                                        }}
                                        onClick={handleRegister}
                                      >
                                        Register
                                      </span>
                                    </p>
                                  </form>

                                  <div className="text-center mt-1 w-1/4 mx-auto pt-2 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-all">
                                    <GoogleOAuthProvider clientId="497194151856-8ljsv11npsqu14n38tj38mkoo83m6ies.apps.googleusercontent.com">
                                      <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                          const token = credentialResponse.credential;
                                          if (token) {
                                            try {
                                              const res = await postData("auth/google-login", { tokenId: token });
                                              const data = await res;
                                              console.log("BBBBBB:=>", data);
                                              if (res?.success === true) {
                                                toast.success("Google login successful!");
                                                localStorage.setItem("biziffyToken", res?.token);
                                                localStorage.setItem("biziffyUser", JSON.stringify(res?.user));
                                                setSuccessMessage("Login successful! Redirecting...");
                                                setLoginError("");
                                                setTimeout(() => {
                                                  const modalElement = document.getElementById("exampleModalToggle");
                                                  const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                                                  modalInstance.hide();
                                                  window.location.reload();
                                                }, 1000);
                                              } else {
                                                toast.success(res?.message || "Google login failed.");
                                                setLoginError(data.message || "Google login failed.");
                                              }
                                            } catch (error) {
                                              console.error("Google Login Error:", error);
                                              setLoginError("Something went wrong with Google login.");
                                            }
                                          }
                                        }}
                                        onError={() => {
                                          setLoginError("Google login failed. Please try again.");
                                        }}
                                      />
                                    </GoogleOAuthProvider>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="business-card"
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "20px",
                          }}
                          onClick={handleCardClick}
                        >
                          <div>
                            <Image
                              src={
                                biz?.businessCategory?.businessImages?.[0] ||
                                null
                              }
                              alt={biz?.name || "Business"}
                              className="listing-image"
                              width={300}
                              height={300}
                              priority
                            />
                          </div>
                          <div style={{ width: "100%" }}>
                            <div className="d-flex justify-content-between gap-3 mb-2 align-items-center">
                              <h5>
                                {biz?.businessDetails?.businessName?.length > 45
                                  ? biz.businessDetails.businessName.slice(
                                    0,
                                    20
                                  ) + "..."
                                  : biz.businessDetails.businessName}
                              </h5>
                            </div>

                            <div className="d-flex gap-2 align-items-center">
                              <p>
                                {avgRating} {' '}
                                {[...Array(Math?.floor(avgRating))]?.map(
                                  (_, i) => (
                                    <i
                                      key={i}
                                      className="bi bi-star-fill text-success"
                                    ></i>
                                  )
                                )}{" "}
                                {/* | */}
                                {biz?.reviews?.length > 0 &&
                                  biz?.reviews?.length}
                              </p>
                              <p>{biz?.businessCategory?.category?.name}</p>
                            </div>

                            <div className="d-flex gap-2 align-items-center">
                              <p>
                                {biz?.businessDetails?.yib || "0.6"} years in
                                business
                              </p>
                              {/* <span>|</span> */}
                              <p>
                                {biz?.businessDetails?.city},{" "}
                                {biz?.businessDetails?.state}
                              </p>
                            </div>

                            <div className="d-flex gap-2 align-items-center">
                              <div className="opening-hours-container">
                                <p
                                  className={`status ${isOpen ? "open" : "closed"
                                    }`}
                                >
                                  {isOpen ? "Open Now" : "Closed Now"}
                                </p>
                              </div>
                              {/* <span>|</span> */}
                              <p>Mobile: {biz?.contactPerson?.contactNumber}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* View More Button */}
                  {businesses.length > 4 && (
                    <div className="text-center mt-3">
                      <button
                        className="business-listing-black-btn"
                        onClick={handleToggleView}
                      >
                        {visibleCount >= businesses.length
                          ? "View Less"
                          : "View More"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Paid Listing Section */}
              {websiteList?.length > 0 && (
                <div className="col-md-6">
                  <PaidListing websiteList={websiteList} user={user} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {filteredBottomAdvertisements.length > 0 && (
        <div className="container">
          <div className="listing-banner mt-0 mb-3">
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              slidesPerView={1}
            >
              {filteredBottomAdvertisements?.map((img, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={img?.image}
                    alt={`Banner ${index + 1}`}
                    className="business-listing-image"
                    width={100}
                    height={100}
                    objectFit="fill"
                    priority
                    quality={100}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default Businesslisting;
