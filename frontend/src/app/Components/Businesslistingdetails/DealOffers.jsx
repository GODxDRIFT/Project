"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getData } from "../../services/FetchNodeServices";
import { useRouter } from "next/navigation";

const DealOffers = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    popularCities: [],
    popularSubCategory: [],
  });
  const [location, setLocation] = useState({ city: "", state: "", pincode: "" });
  const [localLocation, setLocalLocation] = useState({})
  const [error, setError] = useState("");

  // Fetch active popular cities
  const fetchPopularCities = async () => {
    try {
      const res = await getData("populerCity/get-all-popular-cities");
      if (res?.status === true) {
        setFormData((prev) => ({
          ...prev,
          popularCities: res.data.filter((item) => item?.isActive),
        }));
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  // Fetch active subcategories
  const fetchPopularSubCategories = async () => {
    try {
      const res = await getData("admin/subcategories");
      setFormData((prev) => ({
        ...prev,
        popularSubCategory: res?.filter((item) => item?.status === "active" && item?.statusFooter === true) || [],
      }));
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  // Get user location

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const start = Date.now();
          const response = await getData(`googleApi/reverse-geocode?lat=${latitude}&lon=${longitude}`);
          console.log("API time:=>", Date.now() - start, "ms");
          // console.log("Detected location response:", response);

          if (response?.status === true) {
            const detectedLocation = {
              area: response.area || "",
              city: response?.city || "",
              state: response.state || "",
              pinCode: response.pincode || "",
            };

            setLocation(detectedLocation);
            localStorage.setItem("biziffyLocation", JSON.stringify(detectedLocation));
            setLocalLocation(detectedLocation);
            // setSelectedLocation(null);
          } else {
            alert("Failed to fetch location data.");
          }
        } catch (error) {
          console.error("Error getting location:", error);
          alert("Something went wrong while detecting your location.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Permission denied or unable to access your location.");
      }
    );
  };

  useEffect(() => {
    fetchPopularCities();
    fetchPopularSubCategories();

  }, []);

  useEffect(() => {
    const location = localStorage.getItem("biziffyLocation");
    if (location) {
      setLocalLocation(JSON.parse(location))
    } else {
      handleDetectLocation()
    }
  }, [])

  // console.log("HGGGG:==>", location)
  // Slugify function
  const slugify = (text = "") =>
    text
      .toLowerCase()
      .trim()
      .replace(/,/g, "--")
      .replace(/&/g, "and")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleSubCategoryClick = (subcategory) => {
    const state = localLocation ? localLocation.stateName || localLocation.state : location?.state || location?.stateName;
    const pinCode = localLocation ? localLocation.pincode || localLocation.pinCode : location?.pinCode || location?.pincode;
    // console.log("HHHHHHHH:==>", localLocation, location, subcategory?.name)
    router.push(
      `/pages/bussiness-listing/${pinCode}/${slugify(state)}/${slugify(subcategory?.name)}`
    );
  };

  const handleCityClick = (city) => {
    // alert(JSON.stringify(city.city.name))
    router.push(
      `/pages/citytourismGuide/${slugify(city?.city?.name||'FIND')}`
    );
  };


  return (
    <div className="container my-4">
      {/* Popular Cities */}
      <div className="mb-4">
        <h6 className="fw-bold">Popular Cities</h6>
        <div className="d-flex flex-wrap gap-2" style={{ fontSize: "14px" }}>
          {formData?.popularCities?.map((item, index) => (
            <span key={index} onClick={() => handleCityClick(item)} style={{ cursor: 'pointer' }}>
              {item?.city?.name}
              {index !== formData.popularCities.length - 1 && (
                <span className="mx-2 text-muted">|</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Popular Subcategories */}
      <div className="mb-4">
        <h6 className="fw-bold">Explore Biziffy Collections</h6>
        <div className="d-flex flex-wrap gap-2" style={{ fontSize: "12px", cursor: "pointer" }}>
          {formData?.popularSubCategory?.map((item, index) => (
            <span key={index} onClick={() => handleSubCategoryClick(item)}>
              {item?.name}
              {index !== formData.popularSubCategory.length - 1 && (
                <span className="mx-2 text-muted">|</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealOffers;
