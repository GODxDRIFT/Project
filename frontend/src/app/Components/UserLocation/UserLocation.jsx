"use client";

import React, { useEffect, useState } from "react";
import "./location.css";
import { getData } from "../../services/FetchNodeServices";

export default function UserLocation({ location, setLocation }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem("biziffyLocation");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.city || parsed?.area) {
          setLocation(parsed);
          return;
        }
      } catch (_) {}
    }

    const timeout = setTimeout(() => {
      handleDetectLocation();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await getData(
            `googleApi/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );

          if (response?.status === true) {
            const detectedLocation = {
              area: response.area || "",
              city: response.city || "",
              state: response.state || "",
              pinCode: response.pincode || "",
            };
            setLocation(detectedLocation);
            localStorage.setItem("biziffyLocation", JSON.stringify(detectedLocation));
          } else {
            setError("Could not fetch location.");
          }
        } catch (err) {
          console.error("Location fetch error:", err);
          setError("Something went wrong.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Location permission denied.");
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const truncateLocation = (text) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.length <= 3 ? text : `${words.slice(0, 3).join(" ")}...`;
  };

  if (loading) {
    return (
      <div>
        <p className="m-0 p-0 location-detact">Finding location...</p>
      </div>
    );
  }

  return (
    <div>
      {location?.city || location?.area ? (
        <div className="d-flex text-start">
          <p
            className="m-0 p-0 location-detact"
            title={`${location?.city || location?.area} ${location?.state}`}
            onClick={handleDetectLocation}
            style={{ cursor: "pointer" }}
          >
            {truncateLocation(`${location?.city || location?.area} ${location?.state}`)}
          </p>
        </div>
      ) : (
        <div>
          <p
            className="m-0 p-0 location-detact"
            onClick={handleDetectLocation}
            style={{ cursor: "pointer" }}
          >
            {error ? "Detect Location" : "Finding location..."}
          </p>
        </div>
      )}
    </div>
  );
}
