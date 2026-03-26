// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Image from "next/image";
// import "./subCategoryComp.css";
// import "../../pages/citytourismGuide/citytourismGuide.css";
// import { getData } from "../../services/FetchNodeServices";
// import defaultImage from "../../Images/Favicon.jpg"

// const SubcategoryComponent = ({ Id }) => {
//   const searchParams = useSearchParams();
//   // const categoryId = searchParams.get("categoryId");
//   const router = useRouter();

//   const [category, setCategory] = useState(null);
//   const [subcategories, setSubcategories] = useState([]);
//   const [location, setLocation] = useState(null);
//   const [localLocation, setLocalLocation] = useState(null);
//   const [loadingCategory, setLoadingCategory] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch category and subcategories
//   useEffect(() => {
//     const fetchCategoryDetails = async () => {
//       if (!Id) return;
//       try {
//         setLoadingCategory(true);
//         const response = await getData(`categories/${Id}`);
//         setCategory(response || null);
//         setSubcategories(response?.subcategories || []);
//         setError(null);
//       } catch (err) {
//         console.error("Category fetch failed:", err);
//         setError("Failed to load category data.");
//       } finally {
//         setLoadingCategory(false);
//       }
//     };

//     fetchCategoryDetails();
//   }, [Id]);

//   useEffect(() => {
//     const location = localStorage.getItem("biziffyLocation");
//     if (location) {
//       setLocalLocation(JSON.parse(location))
//     } else {
//       handleDetectLocation()
//     }
//   }, [])

//   const handleDetectLocation = async () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser.");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;

//         try {
//           const response = await getData(
//             `googleApi/reverse-geocode?lat=${latitude}&lon=${longitude}`
//           );
//           console.log("Detected location response:", response);

//           if (response?.status === true) {
//             const detectedLocation = {
//               area: response.area || "",
//               city: response.city || "",
//               state: response.state || "",
//               pinCode: response.pincode || "",
//             };

//             setLocation(detectedLocation);
//             localStorage.setItem("biziffyLocation", JSON.stringify(detectedLocation));
//             setLocalLocation(detectedLocation);
//           } else {
//             alert("Failed to fetch location data.");
//           }
//         } catch (error) {
//           console.error("Error getting location:", error);
//           alert("Something went wrong while detecting your location.");
//         }
//       },
//       (error) => {
//         console.error("Geolocation error:", error);
//         alert("Permission denied or unable to access your location.");
//       }
//     );
//   };


//   const slugify = (text) =>
//     text
//       .toLowerCase()
//       .trim()
//       .replace(/,/g, "--")
//       .replace(/&/g, "and")
//       .replace(/\s+/g, "-")
//       .replace(/[^\w-]+/g, "");

//   const handleSubcategoryClick = (sub) => {
//     console.log("XXXX:==>???", localLocation)
//     const state = localLocation.length > 0 ? localLocation?.stateName || localLocation?.state : location?.state || location?.stateName;
//     const pinCode = localLocation.length > 0 ? localLocation?.pincode || localLocation?.pinCode : location?.pinCode || location?.pincode;
//     console.log("XXXX:==>???", state, pinCode)
//     const catName = sub?.name;
//     if (pinCode || state) {
//       router.push(
//         `/pages/bussiness-listing/${pinCode || 12121}/${slugify(
//           state || "state"
//         )}/${slugify(catName)}`
//         // `/pages/bussiness-listing?query=${catName?.trim()}&pincode=${pincode}&state=${state}`
//       );
//     } else {
//       // alert("Need pinCode Pleas wait")
//     }
//   };

//   // Fallback UI
//   if (!Id) return <div className="loader">❗ Category ID is missing...</div>;
//   if (loadingCategory)
//     return (
//       <div className="container">
//         <div className="row g-4">
//           {[...Array(3)].map((_, index) => (
//             <div className="col-6 col-sm-3 col-md-4" key={index}>
//               <div className="card shadow-sm">
//                 <div
//                   className="placeholder-glow"
//                   style={{ height: "150px", backgroundColor: "#e0e0e0" }}
//                 ></div>
//                 <div className="card-body">
//                   <h5 className="card-title placeholder-glow">
//                     <span className="placeholder col-6"></span>
//                   </h5>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   if (error) return <div className="error-msg">⚠️ {error}</div>;

//   return (
//     <>
//       {/* Banner Section */}
//       <section>
//         <div className="all-breadcrumb position-relative">
//           <Image
//             src={category?.banner || "/images/default-banner.jpg"}
//             alt={category?.name || "Category Banner"}
//             layout="fill"
//             objectFit="cover"
//             className="breadcrumb-banner-img"
//             priority
//           />
//           <div className="city-bread-overlay"></div>
//           <div className="container">
//             <div className="bread-content">
//               <h1>{category?.name || "Category"}</h1>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Subcategories Grid */}
//       <section className="subcategory-section">
//         <div className="container">
//           <div className="row justify-content-center">
//             {subcategories?.length > 0 ? (
//               subcategories?.map((sub) => (
//                 <div key={sub?._id} className="col-md-3 col-sm-4 col-6">
//                   <div
//                     className="subcategory-card"
//                     role="button"
//                     tabIndex={0}
//                     onClick={() => handleSubcategoryClick(sub)}
//                     onKeyDown={(e) =>
//                       e.key === "Enter" && handleSubcategoryClick(sub)
//                     }
//                   >
//                     <div className="subcategory-filter-img">
//                       <Image
//                         src={sub?.image || defaultImage}
//                         alt={sub?.name}
//                         width={300}
//                         height={200}
//                       />
//                     </div>
//                     <h4 className="sub-cate-title">{sub?.name}</h4>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center w-100">
//                 🚫 No subcategories available.
//               </p>
//             )}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default SubcategoryComponent;

// {
//   /* <div className="text-center mt-4 mb-4">
//           <button className="btn btn-primary" type="submit">
//             View All Categories
//           </button>
//         </div> */
// }


"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./subCategoryComp.css";
import "../../pages/citytourismGuide/citytourismGuide.css";
import { getData } from "../../services/FetchNodeServices";
import defaultImage from "../../Images/Favicon.jpg";

const SubcategoryComponent = ({ Id }) => {
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const formatSlugs = (slug) => {
    if (!slug) return "";

    return slug.replace(/-and-/g, " & ").replace(/--/g, ",").replace(/-/g, " ").replace(/\s+/g, " ").trim().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };
  console.log("DDDDDDD:==>", formatSlugs(Id))

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!Id) return;

    const fetchCategoryDetails = async () => {
      setLoading(true);
      try {
        const response = await getData(`admin/subcategories`);
        const response2 = await getData(`categories`);
        // console.log("GG=>>", response2.map((item) => item?.name), formatSlugs(Id));
        // console.log("GG=>>", response2.filter((item) => item?.name === formatSlugs(Id)));
        setCategory(response2.filter((item) => formatSlugs(item?.name) === formatSlugs(Id)) || []);
        setSubcategories(response.filter((item) => formatSlugs(item?.category?.name) === formatSlugs(Id)) || []);
        setError("");
      } catch (err) {
        console.error("Category fetch error:", err);
        setError("Failed to load category data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [Id]);

  useEffect(() => {
    const savedLocation = localStorage.getItem("biziffyLocation");

    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else {
      detectLocation();
    }
  }, []);

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await getData(
            `googleApi/reverse-geocode?lat=${coords.latitude}&lon=${coords.longitude}`
          );

          if (response?.status) {
            const detected = {
              area: response.area || "",
              city: response.city || "",
              state: response.state || "",
              pinCode: response.pincode || "",
            };

            setLocation(detected);
            localStorage.setItem("biziffyLocation", JSON.stringify(detected));
          } else {
            alert("Failed to detect location.");
          }
        } catch (error) {
          console.error("Location detection error:", error);
          alert("Error detecting location.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Permission denied or unable to access your location.");
      }
    );
  };

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/,/g, "--")
      .replace(/&/g, "and")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleSubcategoryClick = (sub) => {
    const state = location?.state || location?.stateName || "state";
    const pinCode = location?.pinCode || location?.pincode || "000000";
    const categorySlug = slugify(sub?.name || "category");

    router.push(
      `/pages/bussiness-listing/${pinCode}/${slugify(state)}/${categorySlug}`
    );
  };

  if (!Id) {
    return <div className="loader">❗ Category ID is missing...</div>;
  }

  if (loading) {
    return (
      <div className="container">
        <div className="row g-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div className="col-6 col-sm-4 col-md-3" key={idx}>
              <div className="card placeholder-card">
                <div className="image-placeholder" />
                <div className="card-body">
                  <div className="placeholder-title" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error-msg">⚠️ {error}</div>;
  }



  return (
    <>
      {/* Banner Section */}
      <section>
        <div className="all-breadcrumb position-relative">
          <Image
            src={category[0]?.banner || "/images/default-banner.jpg"}
            alt={`${category[0]?.name || "Category"} Banner`}
            layout="fill"
            objectFit="fill"
            className="breadcrumb-banner-img"
            priority
          />
          <div className="city-bread-overlay"></div>
          <div className="container">
            <div className="bread-content">
              {/* <h1>{category?.name || "Category"}</h1> */}
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories Grid */}
      <section className="subcategory-section">
        <div className="container">
          <div className="row justify-content-center">
            {subcategories.length ? (
              subcategories.map((sub) => (
                <div key={sub?._id} className="col-md-3 mb-3 col-sm-4 col-6">
                  <div
                    className="subcategory-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSubcategoryClick(sub)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubcategoryClick(sub)}
                  >
                    <div className="subcategory-filter-img">
                      <Image
                        src={sub?.image || defaultImage}
                        alt={sub?.name || "Subcategory"}
                        width={300}
                        height={200}
                      // className="img-fluid"
                      />
                    </div>
                    <h4 className="sub-cate-title">{sub?.name}</h4>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center w-100">🚫 No subcategories available.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SubcategoryComponent;
