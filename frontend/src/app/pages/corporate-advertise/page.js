"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./CoprateAdvertise.css";
import { motion } from "framer-motion";
import Head from "next/head";

import defaultImage from "../../Images/Favicon.jpg";
import coprateAdvertise from "../../Images/CoprateAdversite.jpg";
import wideaudince from "../../Images/WideReach.jpg";
import costeffective from "../../Images/CostEffective.jpg";
import customize from "../../Images/CustomizePlanes.jpg";
import target from "../../Images/TargetAduince.jpg";
import moveintime from "../../Images/MoveInTime.jpg";
import RoadMap from "../../Components/RoadMap/RoadMap";
import BulkSms from "../../Components/BulkBusinessListingBenefits/BusinessListingBenefits";
import { useRouter } from "next/navigation";
import { getData, postData } from "../../services/FetchNodeServices";
import Skeleton from "react-loading-skeleton";
import swel from "sweetalert2"

function Page() {
  // =========================================

  const features = [
    {
      id: 1,
      title: "Wider Audience Reach",
      image: wideaudince,
      points: [
        {
          icon: "bi-graph-up-arrow",
          title: "Expand Your Visibility",
          text: "Showcase your brand across multiple Biziffy pages.",
        },
        // {
        //   icon: "bi-people",
        //   title: "Reach More Customers",
        //   text: "Get noticed by a larger audience on Biziffy.",
        // },
        // {
        //   icon: "bi-megaphone",
        //   title: "Boost Your Brand",
        //   text: "Feature your business on high-traffic Biziffy pages.",
        // },
        // {
        //   icon: "bi-eye",
        //   title: "Maximize Exposure",
        //   text: "Promote your brand on Biziffy diverse platform.",
        // },
      ],
    },
    {
      id: 2,
      title: "Cost-Effective Solutions",
      image: costeffective,
      points: [
        {
          icon: "bi-cash-stack",
          title: "Budget-Friendly Promotion",
          text: "Market your business without breaking the bank.",
        },
        {
          icon: "bi-graph-up",
          title: "High ROI Advertising",
          text: "Maximize your reach while keeping costs low.",
        },
        {
          icon: "bi-megaphone",
          title: "Cost-Effective Marketing",
          text: "Affordable solutions tailored to your business needs.",
        },
        {
          icon: "bi-globe2",
          title: "Wide Visibility & Low Cost",
          text: "Expand your audience without overspending.",
        },
      ],
    },
    {
      id: 3,
      title: "Customizable Packages",
      image: customize,
      points: [
        {
          icon: "bi-sliders",
          title: "Flexible Plans",
          text: "Choose a package that fits your budget and goals.",
        },
        {
          icon: "bi-gear-wide-connected",
          title: "Tailored Solutions",
          text: "Customize your listing based on your business needs.",
        },
        {
          icon: "bi-briefcase",
          title: "Business-Friendly Options",
          text: "Get a package designed to enhance your brand visibility.",
        },
        {
          icon: "bi-stars",
          title: "Premium & Standard Plans",
          text: "Select from various plans to suit your advertising goals.",
        },
      ],
    },
    {
      id: 4,
      title: "Targeted Marketing",
      image: target,
      points: [
        {
          icon: "bi-geo-alt",
          title: "Location-Based Reach",
          text: "Connect with customers in specific regions or cities.",
        },
        {
          icon: "bi-people",
          title: "Interest-Based Targeting",
          text: "Engage audiences who are interested in your products or services.",
        },
        {
          icon: "bi-bar-chart",
          title: "Demographic Focus",
          text: "Promote your business to the right age, gender, and audience groups.",
        },
        {
          icon: "bi-bullseye",
          title: "Smart Advertising",
          text: "Use data-driven strategies to attract potential customers.",
        },
      ],
    },
    {
      id: 5,
      title: "Fast & Efficient Services",
      image: moveintime,
      points: [
        {
          icon: "bi-lightning",
          title: "Quick Turnaround",
          text: "Get your campaigns live in no time with our fast process.",
        },
        {
          icon: "bi-gear",
          title: "Streamlined Execution",
          text: "Effortless setup and smooth handling of your advertising needs.",
        },
        {
          icon: "bi-clock",
          title: "Time-Saving Solutions",
          text: "We handle everything efficiently, so you can focus on business growth.",
        },
        {
          icon: "bi-rocket",
          title: "Instant Visibility",
          text: "Boost your brand's exposure quickly with our optimized services.",
        },
      ],
    },
  ];

  // =======================================
  const CARD_PX = 150;

  const [showForm, setShowForm] = useState(true);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState({});
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ boxType: "Advertisement", firstName: "", lastName: "", businessName: "", brandName: "", phone: "", email: "", message: "", });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For phone number, allow only digits and max 10 characters
    if (name === "phone") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    // Optional: simple validation
    if (formData.phone.length !== 10) {
      setFormLoading(false);
      alert("Phone number must be 10 digits.");
      return;
    }
    const payload = { ...formData };
    const respons = await postData("corporateAdvertise/create-corporateAdvertise", payload);
    if (respons?.status === true) {
      // toast.success("Form submitted successfully!");
      swel.fire('Success', "Form submitted successfully!", 'success')
      setFormData({ boxType: "Advertisement", firstName: "", lastName: "", businessName: "", brandName: "", phone: "", email: "", message: "", });
      setFormLoading(false);
    } else {
      swel.fire('Error', "Form submission failed!", 'error')
      setFormLoading(false);
    }
  };


  useEffect(() => {
    (async () => {
      try {
        const res = await getData("admin/subcategories");
        setCategories(res);
      } catch (e) {
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const lat = coords?.latitude;
        const lon = coords?.longitude;
        try {
          const response = await getData(`googleApi/reverse-geocode?lat=${lat}&lon=${lon}`);

          if (response?.status === true && Array.isArray(response.raw)) {
            const addressComponents = response.raw[0]?.address_components || [];

            // Helper function to extract a specific component
            const getComponent = (type) => {
              const component = addressComponents.find((comp) => comp.types.includes(type));
              return component?.long_name || "";
            };

            // Set location from parsed components
            setLocation({
              city:
                getComponent("locality") ||
                getComponent("administrative_area_level_2") || "", // fallback district
              state: getComponent("administrative_area_level_1"),
              pincode: getComponent("postal_code"),
            });

          } else {
            console.warn("Reverse geocoding failed:", response);
            setLocation({ city: "", state: "", pincode: "" });
          }

        } catch (error) {
          console.error("Geocoding error:", error);
          setError("Unable to determine your location.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Location access denied or failed.");
      }
    );
    const user = localStorage.getItem("biziffyUser")
    setFormData(prev => ({ ...prev, userId: JSON.parse(user)?._id }));

  }, []);


  const slugify = (text) => text.toLowerCase().trim().replace(/,/g, "--").replace(/&/g, "and").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  const handleClick = (card) => {
    const { pincode = "", state = "" } = location;
    router.push(
      `/pages/bussiness-listing/${pincode}/${slugify(state)}/${slugify(card?.name)}`
    );
  };


  const handleFormToggle = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      <Head>
        <title>
          Corporate Advertising | Premium Plans & Free Business Listing -
          Biziffy
        </title>
        <meta
          name="description"
          content="Promote your business with Biziffy’s premium membership plans or get started with our free business listing. Reach local customers and grow digitally with corporate advertising options."
        />
        <meta
          name="keywords"
          content="corporate advertising, advertise with Biziffy, business listing plans, premium membership, free business listing, business promotion plans, local business marketing, small business ads, online business listing, advertise business online, Biziffy plans, grow your business, digital promotion, business directory listing, paid business listing, affordable advertising, business exposure, premium leads, featured listing, verified listing Biziffy, business visibility online, business plans India, marketing membership, corporate branding, Biziffy advertising services"
        />

        {/* Open Graph Tags */}
        <meta
          property="og:title"
          content="Advertise with Biziffy | Premium Plans & Business Listing"
        />
        <meta
          property="og:description"
          content="Boost your online visibility with Biziffy’s premium advertising options. Choose free or paid plans to grow your local business digitally."
        />
        <meta
          property="og:url"
          content="https://biziffy.com/corporate-advertise"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Biziffy" />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Corporate Advertising | Biziffy Premium Plans"
        />
        <meta
          name="twitter:description"
          content="Get listed and advertise with Biziffy. Choose from premium membership or free business listing to expand your business reach."
        />
        <meta name="twitter:creator" content="@biziffy" />
      </Head>

      <section className="some-page-hero-bg">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="some-page-hero-content">
                <motion.h1
                  className="some-page-hero-title"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  Are you{" "}
                  <span style={{ color: "var(--blue)" }}>
                    looking to expand
                  </span>{" "}
                  business reach ?
                </motion.h1>
                <motion.p
                  className="some-page-hero-subtitle"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                >
                  <b>
                    Bizi<span style={{ color: "var(--blue)" }}>ff</span>y
                  </b>{" "}
                  offers Bulk Advertisement & Business Listing services.{" "}
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <div className="biziffy-coprate-image-div">
                <Image

                  priority
                  src={coprateAdvertise}
                  alt="Biziffy coprate us"
                  className="biziffy-coprate-image"
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="biziffy-coprate-content">
                <h1 className="biziffy-coprate-title">
                  We are a Bizi<span style={{ color: "var(--blue)" }}>ff</span>y
                  that offers Bulk Business Listing & Bulk Advertising Benefits.
                </h1>
                <motion.p
                  className="biziffy-coprate-text"
                  initial={{ opacity: 0, x: -50 }} // Slide in from the left
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  Looking for a way to grow your business and attract more
                  customers? Biziffy provides Bulk Advertisement & Business
                  Listing services that help you reach a wider audience&lsquo;
                  improve visibility&lsquo; and establish credibility in your
                  industry. Whether you&apos;re a startup or an established
                  business&lsquo; our platform ensures that your brand gets the
                  recognition it deserves.
                </motion.p>
                <motion.p
                  className="biziffy-coprate-text"
                  initial={{ opacity: 0, y: 50 }} // Slide in from the right
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }} // Delay to make it smoother
                  viewport={{ once: true, amount: 0.2 }}
                >
                  In a competitive market&lsquo; having a strong online presence
                  is key to success. Biziffy&apos;s Bulk Business Listing
                  services allow you to feature your business on multiple
                  high-traffic directories&lsquo; search engines&lsquo; and
                  listing platforms. This ensures that potential customers can
                  easily find you when searching for relevant services. With
                  consistent and accurate business information&lsquo; your brand
                  becomes more discoverable&lsquo; leading to increased
                  inquiries and higher conversion rates.
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="coprate-page-count-content">
                <h1 className="coprate-page-count-title">
                  Why Choose Bizi
                  <span style={{ color: "var(--blue)" }}>ff</span>y.com for Bulk
                  Advertising?
                </h1>
              </div>
              {features.map((feature, index) => (
                <motion.div
                  className="row coprate-why-choose-us-data"
                  key={feature.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <div
                    className={`col-md-4 ${index % 2 === 0
                      ? "order-md-1 order-1"
                      : "order-md-2 order-1"
                      }`}
                  >
                    <div className="coprate-why-choose-div">
                      <Image

                        priority
                        src={feature.image}
                        alt="Corporate Image"
                        className="coprate-why-choose-img"
                      />
                    </div>
                  </div>
                  <div
                    className={`col-md-8 ${index % 2 === 0
                      ? "order-md-2 order-2"
                      : "order-md-1 order-2"
                      }`}
                  >
                    <div className="coprate-why-choose-img-data">
                      <h5>
                        {feature.id}. {feature.title}
                      </h5>
                      {feature.points.map((point, i) => (
                        <div key={i}>
                          <h4>
                            <i className={`bi ${point.icon}`}></i> {point.title}
                          </h4>
                          <p>{point.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="coprate-page-count-content">
          <h1 className="coprate-page-count-title">
            Bulk Business{" "}
            <span style={{ color: "var(--blue)" }}> Listing </span>
            Benefits
          </h1>
        </div>
        <BulkSms />
      </section>

      <section className="coprate-category-section">
        <div className="container">
          <div className="coprate-page-count-content">
            <h1 className="coprate-page-count-title">
              Industries<span style={{ color: "var(--blue)" }}> We </span>Serve
            </h1>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={5}
            navigation
            pagination={false}   // 👈 Disable dots
            autoplay={true}
            breakpoints={{
              320: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="coprate-category-swiper"
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <div className="home-category-card">
                    <Skeleton height={CARD_PX} width="100%" borderRadius={12} />
                    <div className="card-body pt-2">
                      <Skeleton height={20} width="60%" />
                    </div>
                  </div>
                </SwiperSlide>
              ))
              : categories?.map((card) => (
                <SwiperSlide key={card?._id}>
                  <div
                    className="home-category-card text-center"
                    onClick={() => handleClick(card)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleClick(card)}
                  >
                    
                    <Image
                      src={card?.image || defaultImage}
                      alt={card?.name || "Category"}
                      width={CARD_PX}
                      height={CARD_PX}
                      priority
                      quality={100}
                      className="home-category-card-image"
                    />
                    <div className="card-body pt-2">
                      <p className="corporate-descri m-0">{card?.name}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>

        </div>
      </section>

      <section>
        <div className="coprate-page-count-content">
          <h1 className="coprate-page-count-title">
            How<span style={{ color: "var(--blue)" }}> It </span>Works
          </h1>
        </div>
        <RoadMap />
      </section>

      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="coprate-page-count-content">
                <h1 className="coprate-page-count-title">
                  Get Started{" "}
                  <span style={{ color: "var(--blue)" }}> Today </span>
                  with Bizi<span style={{ color: "var(--blue)" }}>ff</span>
                  y.com!
                </h1>
              </div>
              <div className="coprate-form-btn">
                <button className="login-btn mb-3" onClick={handleFormToggle}>
                  {showForm ? "Hide Form" : "Get Started Now"}{" "}
                  <i className="bi bi-arrow-right-circle"></i>
                </button>
              </div>

              {showForm && (
                <div className="card p-4 mb-4">
                  <h4 className="mb-3">Corporate Advertise</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label>Choose Box:</label>
                      <select value={formData.boxType} name="boxType" onChange={handleChange} className="form-select">
                        <option value={"Advertisement"}>Advertisement</option>
                        <option value={"Bulk Listing"}>Bulk Listing</option>
                        <option value={"Business Listing"}>Business Listing</option>
                        <option value={"Website Listing"}>Website Listing</option>
                      </select>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="login-input" placeholder="First Name" />
                      </div>

                      <div className="col-md-6 mb-3">
                        <input type="text" required name="lastName" className="login-input" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <input type="text" required name="businessName" className="login-input" value={formData.businessName} onChange={handleChange} placeholder="Business Name" />
                      </div>

                      <div className="mb-3 col-md-6">
                        <input type="text" required name="brandName" className="login-input" value={formData.brandName} onChange={handleChange} placeholder="Brand Name" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <input type="text" required name="phone" className="login-input" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
                      </div>

                      <div className="mb-3 col-md-6">
                        <input type="email" required name="email" className="login-input" value={formData.email} onChange={handleChange} placeholder="Email" />
                      </div>
                    </div>

                    {/* <div className="mb-3">
                      <label>Upload File</label>
                      <input type="file" className="login-input" />
                    </div> */}

                    <div className="mb-3">
                      <textarea className="login-input" name="message" required rows="4" value={formData.message} onChange={handleChange} placeholder="Type your message"></textarea>
                    </div>

                    <div className="coprate-form-btn">
                      <button type="submit" disabled={formLoading} className="login-btn">
                        {formLoading ? "Submitting..." : 'Submit'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Page;
