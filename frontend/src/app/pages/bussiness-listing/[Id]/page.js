"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Businesslistingdetails from "../../../Components/Businesslistingdetails/Businesslistingdetails";
import { getData } from "../../../services/FetchNodeServices";
import Loadingcomponent from "../../../Components/loadingcomponent/Loadingcomponent";

let formatSlugs = (slug) => {
  if (!slug) return "";
  return slug.replace(/-and-/g, " & ").replace(/--/g, ",").replace(/-/g, " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

const Page = () => {
  const params = useParams();
  // const Id = params?.Id;
  const { Id } = params;
  // alert(JSON.stringify(Id))
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [advertisements, setAdvertisements] = useState([]);

  // useEffect(() => {
  //   console.log("XXXXX:==>", localStorage.getItem("biziffyListingId"))
  // }, [Id])

  const fetchBusinessDetails = async (Id) => {
    try {
      const response = await getData(`get-all-listings-by-id/${localStorage?.getItem("biziffyListingId")}`);
      if (response?.status === true) {
        setBusinesses(response?.data || []);
      } else {
        // setError('Failed to fetch data.');
      }
    } catch (err) {
      setError("Error fetching business details.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const response = await getData("advertisements/get-all-advertisements");
      const activeAds =
        response?.filter(
          (ad) => ad?.status === "Active" && ad?.type === "Right"
        ) || [];
      setAdvertisements(activeAds);
    } catch (error) {
      console.error("Failed to fetch advertisements:", error);
      setAdvertisements([]);
    }
  };

  useEffect(() => {
    if (Id) {
      fetchBusinessDetails(Id);
      fetchAdvertisements(Id);
    }
  }, [Id]);

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <Loadingcomponent />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <Businesslistingdetails
            fetchBusinessDetails={fetchBusinessDetails}
            Id={Id}
            advertisements={advertisements}
            businesses={businesses}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
