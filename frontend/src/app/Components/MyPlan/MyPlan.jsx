// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getData } from "../../services/FetchNodeServices";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import InvoicePDF from "../ListingBillInvoicePDF/InvoicePDF";

// export default function MyPlan() {
//     const [userId, setUserId] = useState(null);
//     const [planData, setPlanData] = useState([]);
//     const router = useRouter();

//     const fetchPlanData = async (userId) => {
//         try {
//             const response = await getData(`membership/get-all-memberships-by-user/${userId}`);
//             if (response?.status === true) {
//                 setPlanData(response?.data);
//             }
//         } catch (error) {
//             console.error("Error fetching plan data:", error);
//         }
//     };

//     useEffect(() => {
//         try {
//             const storedUser = localStorage.getItem("biziffyUser");
//             if (!storedUser) {
//                 router.push("/pages/login");
//                 return;
//             }

//             const user = JSON.parse(storedUser);
//             if (user?._id) {
//                 setUserId(user?._id);
//                 fetchPlanData(user?._id);
//             } else {
//                 router.push("/pages/login");
//             }
//         } catch (error) {
//             console.error("Invalid user data in localStorage:", error);
//             router.push("/pages/login");
//         }
//     }, [router]);

//     if (!userId) return null;

//     return (
//         <div className="container py-4">
//             <h3 className="mb-4 fw-bold text-primary">My Plan Summary</h3>

//             {planData?.length > 0 ? (
//                 planData.map((item, index) => (
//                     <div key={item._id} className="card shadow-sm border-0 mb-4">
//                         <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
//                             <div>
//                                 <h5 className="mb-1">{item?.planDetails?.name || "Plan"}</h5>
//                                 <small>Plan ID: {item._id}</small>
//                             </div>
//                             <PDFDownloadLink
//                                 document={<InvoicePDF plan={item} />}
//                                 fileName={`Invoice_${item?.orderUniqueId}.pdf`}
//                                 className="btn btn-light btn-sm"
//                             >
//                                 {({ loading }) => (loading ? "Generating..." : "Download Invoice")}
//                             </PDFDownloadLink>
//                         </div>

//                         <div className="">
//                             <div className="row g-3">
//                                 <div className="col-md-6">
//                                     <h6 className="fw-semibold text-secondary">Business Info</h6>
//                                     <p><strong>Business Name:</strong> {item?.businessId?.businessDetails?.businessName || '-'}</p>
//                                     <p><strong>Status:</strong> <span className={item.status ? "text-success" : "text-danger"}>{item.status ? "Active" : "Inactive"}</span></p>
//                                     <p><strong>Payment:</strong> {item.paymentStatus || "N/A"} ({item.paymentMethod})</p>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <h6 className="fw-semibold text-secondary">Plan Details</h6>
//                                     <p><strong>Start Date:</strong> {new Date(item.startDate).toLocaleDateString()}</p>
//                                     <p><strong>End Date:</strong> {new Date(item.endDate).toLocaleDateString()}</p>
//                                     <p><strong>Price:</strong> <span className="text-warning fw-semibold">₹{item.planDetails?.price || 0}</span></p>
//                                 </div>
//                             </div>

//                             {item?.planDetails?.features?.length > 0 && (
//                                 <div className="mt-3">
//                                     <h6 className="fw-semibold text-secondary">Features Included</h6>
//                                     <ul className="list-group" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                                         {item.planDetails.features.map((feature, idx) => (
//                                             <li key={idx} className="list-group-item px-0" style={{padding:'5px'}}>
//                                                 <i className="bi bi-check-circle-fill text-success me-2" style={{marginLeft:'5px'}}  ></i>{feature}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ))
//             ) : (
//                 <div className="alert alert-warning">No active plans found.</div>
//             )}
//         </div>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getData } from "../../services/FetchNodeServices";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../ListingBillInvoicePDF/InvoicePDF";

export default function MyPlan() {
  const [userId, setUserId] = useState(null);
  const [planData, setPlanData] = useState([]);
  const router = useRouter();

  const fetchPlanData = async (userId) => {
    try {
      const response = await getData(`membership/get-all-memberships-by-user/${userId}`);
      if (response?.status) {
        setPlanData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching plan data:", error);
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("biziffyUser");
      if (!storedUser) return router.push("/pages/login");

      const user = JSON.parse(storedUser);
      if (user?._id) {
        setUserId(user._id);
        fetchPlanData(user._id);
      } else {
        router.push("/pages/login");
      }
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      router.push("/pages/login");
    }
  }, [router]);

  if (!userId) return null;

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold text-primary text-center">📋 My Plan Summary</h3>

      {planData.length > 0 ? (
        planData.map((item) => (
          <div key={item._id} className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-primary text-white d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 p-3">
              <div>
                <h5 className="mb-1">{item?.planDetails?.name || "Plan"}</h5>
                <small className="d-block">Plan ID: {item._id}</small>
              </div>
              <PDFDownloadLink
                document={<InvoicePDF plan={item} />}
                fileName={`Invoice_${item?.orderUniqueId}.pdf`}
                className="btn btn-light btn-sm mt-2 mt-md-0"
              >
                {({ loading }) => (loading ? "Generating..." : "📄 Download Invoice")}
              </PDFDownloadLink>
            </div>

            <div className="card-body px-3">
              <div className="row g-4">
                {/* Business Info */}
                <div className="col-12 col-md-6">
                  <h6 className="fw-semibold text-secondary border-bottom pb-1">🏢 Business Info</h6>
                  <p className="mb-1"><strong>Business Name:</strong> {item?.businessId?.businessDetails?.businessName || "-"}</p>
                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <span className={item.status ? "text-success" : "text-danger"}>
                      {item.status ? "Active" : "Inactive"}
                    </span>
                  </p>
                  <p className="mb-1"><strong>Payment:</strong> {item.paymentStatus || "N/A"} ({item.paymentMethod || "N/A"})</p>
                </div>

                {/* Plan Info */}
                <div className="col-12 col-md-6">
                  <h6 className="fw-semibold text-secondary border-bottom pb-1">📦 Plan Details</h6>
                  <p className="mb-1"><strong>Start Date:</strong> {new Date(item.startDate).toLocaleDateString()}</p>
                  <p className="mb-1"><strong>End Date:</strong> {new Date(item.endDate).toLocaleDateString()}</p>
                  <p className="mb-1">
                    <strong>Price:</strong>{" "}
                    <span className="text-warning fw-semibold">₹{item.planDetails?.price || 0}</span>
                  </p>
                </div>
              </div>

              {/* Features */}
              {item?.planDetails?.features?.length > 0 && (
                <div className="mt-3">
                  <h6 className="fw-semibold text-secondary border-bottom pb-1">✅ Features Included</h6>
                  <ul
                    className="list-group list-group-flush mt-2"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {item.planDetails.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="list-group-item px-2 py-1 d-flex align-items-center"
                      >
                        <i className="bi bi-check-circle-fill text-success me-2"></i> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-warning text-center">
          No active plans found. Please purchase a plan to get started.
        </div>
      )}
    </div>
  );
}
