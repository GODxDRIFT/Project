"use client";

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./all-enquiry.css";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { getData } from "../../../services/FetchNodeServices";
import Link from "next/link";
import Loadingcomponent from "../../loadingcomponent/Loadingcomponent";

const Page = () => {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [enquiryData, setEnquiryData] = useState([]);
  const [businessListing, setBusinessListing] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [loading, setLoading] = useState(true);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const fetchEnquiryData = async (uid) => {
    try {
      const res = await getData(`enquiries/get-all-enquiries-by-user/${uid}`);
      setEnquiryData(res?.status ? res?.data : []);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setEnquiryData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessListings = async (uid) => {
    try {
      const res = await getData(`get-all-listings-by-user-id/${uid}`);
      if (res?.status) {
        setBusinessListing(res.data);
        if (!selectedBusinessId) {
          setSelectedBusinessId(res.data?.[0]?._id || "");
        }
      }
    } catch (err) {
      console.error("Error fetching business listings:", err);
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("biziffyUser");
      if (!storedUser) return router.push("/pages/login");

      const user = JSON.parse(storedUser);
      if (!user?._id) return router.push("/pages/login");

      setUserId(user._id);
      fetchEnquiryData(user._id);
      fetchBusinessListings(user._id);
    } catch (err) {
      console.error("Invalid user data:", err);
      router.push("/pages/login");
    }
  }, [router]);

  const filteredEnquiries = enquiryData.filter((enquiry) => {
    const business = businessListing.find((b) => b._id === selectedBusinessId);
    return (
      !selectedBusinessId ||
      enquiry?.BussinesName === business?.businessDetails?.businessName
    );
  });

  return (
    <>
      <Head>
        <title>User Profile | Manage Business & Personal Info - Biziffy</title>
        <meta name="description" content="Manage your personal and business information with your Biziffy profile." />
        <meta property="og:title" content="User Profile | Biziffy" />
        <meta property="og:url" content="https://biziffy.com/profile" />
      </Head>

      <section className="all-enquiry">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <h2 className="edit-profile-title">All Enquiries</h2>
            <select
              className="form-select w-auto mt-3 mt-md-0"
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
            >
              <option value="">All Businesses</option>
              {businessListing.map((item, idx) => (
                <option key={idx} value={item._id}>
                  {item.businessDetails?.businessName || "Unnamed Business"}
                </option>
              ))}
            </select>
          </div>

          <hr />

          {loading ? (
            <div className="text-center text-muted"><Loadingcomponent />
</div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="text-center text-muted">No enquiries found.</div>
          ) : (
            <div className="row">
              {filteredEnquiries.map((enquiry, idx) => {
                const user = enquiry?.userId?.[0];
                const enquiryInfo = enquiry?.enquiryId;

                return (
                  <div key={idx} className="col-md-12 mb-4">
                    <div className="card shadow-sm border-0 p-4 rounded-4 h-100">
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <h5 className="text-primary fw-bold mb-1">
                            {user?.fullName || "Unknown User"}
                          </h5>
                          <div className="d-flex flex-column gap-1">
                            {enquiryInfo?.phone && (
                              <span className="badge text-start bg-light text-dark">
                                <i className="bi bi-telephone-fill text-success me-1"></i>
                                {enquiryInfo.phone}
                              </span>
                            )}
                            {user?.email && (
                              <span className="badge text-start bg-light text-dark">
                                <i className="bi bi-envelope-fill text-primary me-1"></i>
                                {user.email}
                              </span>
                            )}
                          </div>
                        </div>
                        <small className="text-muted">{formatDate(enquiryInfo?.createdAt)}</small>
                      </div>

                      <h6 className="fw-semibold text-dark mt-1">
                        {enquiryInfo?.requirement || "No Requirement"}
                      </h6>
                      <p className="text-muted small mb-0">
                        Category: {enquiryInfo?.category || "N/A"}
                      </p>

                      <div className="d-flex gap-1 mt-auto">
                        {enquiryInfo?.phone && (
                          <Link
                            href={`tel:${enquiryInfo.phone}`}
                            className="btn bg-primary text-white btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            title="Call"
                          >
                            <i className="bi bi-telephone-fill"></i>
                          </Link>
                        )}
                        {user?.email && (
                          <Link
                            href={`mailto:${user.email}`}
                            className="btn bg-success text-white btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            title="Email"
                          >
                            <i className="bi bi-envelope-fill"></i>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
