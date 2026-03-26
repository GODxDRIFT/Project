"use client";

import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";
import "./dashboard.css";
import DashboardDetails from "../DashboardDetails/DashboardDetails";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../Navbar/Navbar"
const Dashboard = ({ businessListing }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [singleData, setSingleData] = useState(businessListing[0]?._id || "");
  const [type, setType] = useState(null);
  const [userProfile, setUserProfile] = useState("");
  const menuRef = useRef();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("biziffyUser"));
    if (storedUser) {
      setUserProfile(storedUser.profileImage);
      setAvatarUrl(storedUser.profileImage);
    }
  }, []);

  useEffect(() => {
    if (businessListing.length > 0 && !singleData) {
      setSingleData(businessListing[0]._id);
    }
  }, [businessListing]);

  const handleLogout = () => {
    toast.info(
      ({ closeToast }) => (
        <div className="p-2">
          <p className="mb-2">Are you sure you want to logout?</p>
          <div className="d-flex justify-content-end gap-2">
            <button
              onClick={() => {
                confirmLogout();
                closeToast();
              }}
              className="btn btn-sm btn-danger"
            >
              Yes
            </button>
            <button onClick={closeToast} className="btn btn-sm btn-secondary">
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const confirmLogout = () => {
    localStorage.removeItem("biziffyUser");
    toast.success("Logout Successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
    window.location.href = "/pages/login";
  };

  const displayTypes = [
    { key: "listings", title: "Total Visits" },
    { key: "whatsapp", title: "WhatsApp Connect" },
    { key: "website", title: "Website Check" },
    { key: "contact", title: "Contact" },
    { key: "share", title: "Profile Share" },
    { key: "direction", title: "Direction" },
  ];

  const filteredData = businessListing?.find(
    (item) => item?._id === singleData
  );

  const clickCounts = filteredData?.clickCounts || {};
  const clickCountsArray = displayTypes.map(({ key, title }) => ({
    key,
    title,
    count: clickCounts[key]?.count || 0,
    user: clickCounts[key]?.user || [],
  }));

  useEffect(() => {
    if (clickCountsArray.length > 0) {
      setType(clickCountsArray[0]);
    }
  }, [singleData]);

  const gradients = [
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
    "linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)",
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  ];

  return (
    <div
      // className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <ToastContainer />
      <div className="flex-grow-1">
        <Navbar />
        {/* <nav className="navbar navbar-light bg-white shadow-sm px-4 d-flex justify-content-between">
          <Link className="navbar-brand" href="/">
            <p className="logo-text">
              Bizi<span>ff</span>y
            </p>
          </Link>

          <div className="position-relative" ref={menuRef}>
            <button
              className="btn border-0 d-flex align-items-center m-0 p-0"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ backgroundColor: "transparent" }}
            >
              {imgError || !avatarUrl ? (
                <i className="bi bi-person-circle fs-3 text-dark" />
              ) : (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  onError={() => setImgError(true)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
            </button>
            {dropdownOpen && (
              <div
                className="position-absolute end-0 bg-white border shadow rounded p-2"
                style={{ minWidth: 160, zIndex: 1000 }}
              >
                <Link href="/pages/Profile" className="dropdown-item py-2">
                  <i className="bi bi-person"></i> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="dropdown-item text-danger py-2"
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            )}
          </div>
        </nav> */}

        <div className="p-3 sm:p-4">
          <div className="row align-items-start justify-content-between mb-4">
            <div className="col-md-8">
              <h2 className="mb-2 sm:mb-3">Dashboard Overview</h2>
            </div>
            <div className="col-md-4">
              <select
                value={singleData}
                onChange={(e) => {
                  setSingleData(e.target.value);
                  setType(null);
                }}
                className="form-control"
              >
                <option value="">Select Business</option>
                {businessListing?.map((item, i) => (
                  <option key={i} value={item?._id}>
                    {item?.businessDetails?.businessName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-4">
            {clickCountsArray.map((data, i) => (
              <div
                key={data.key}
                className="col-md-3 col-6"
                onClick={() => setType(data)}
              >
                <div className="card shadow-sm border-0">
                  <div
                    className="card-body dashboard-card-body"
                    style={{ background: gradients[i % gradients.length] }}
                  >
                    <h5 className="card-title">{data?.title}</h5>
                    <p className="card-text display-6">{data.count}</p>
                    <div
                      className="view-all"
                      style={{ color: "#0d6efd", cursor: "pointer" }}
                    >
                      View All
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <DashboardDetails setType={setType} type={type} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
