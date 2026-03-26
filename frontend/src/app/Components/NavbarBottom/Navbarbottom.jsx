"use client";
import React from "react";
import "./navbarbottom.css";
import { useRouter } from "next/navigation";

const Navbarbottom = ({ isLoggedIn }) => {
  const router = useRouter();
  const handleDashboardClick = () => {
    if (isLoggedIn) {
      router.push("/pages/Profile");
    } else {
      router.push("/pages/login");
    }
  };

  return (
    <div className="bottom-navbar">
      <div className="nav-items" onClick={() => router.push("/")}>
        <i className="bi bi-house-door-fill"></i>
        <span className="nav-label">Home</span>
      </div>

      <div
        className="nav-items"
        onClick={() => router.push("/pages/corporate-advertise")}
      >
        <i className="bi bi-megaphone-fill"></i>
        <span className="nav-label">Advertise</span>
      </div>

      <div
        className="nav-items"
        onClick={() => router.push("/pages/earn-with-us")}
      >
        <i className="bi bi-cash-coin"></i>
        <span className="nav-label">Earn With Us</span>
      </div>
      <div
        className="nav-items"
        onClick={() => router.push("/pages/free-listing")}
      >
        <i className="bi bi-plus-circle-fill"></i>
        <span className="nav-label">Free Listing</span>
      </div>

      <div className="nav-items" onClick={handleDashboardClick}>
        <i className="bi bi-person-circle"></i>
        <span className="nav-label">Dashboard</span>
      </div>
    </div>
  );
};

export default Navbarbottom;
