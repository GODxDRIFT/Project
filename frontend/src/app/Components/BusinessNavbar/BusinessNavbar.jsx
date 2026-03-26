// "use client";
// import React, { useRef, useEffect, useState } from "react";
// import "../Navbar/navbar.css";
// import Link from "next/link";
// import logo from "../../Images/logo.jpg";
// import Image from "next/image";
// import "../../pages/login/page";
// import "./businessNavbar.css";
// import UserLocation from "../UserLocation/UserLocation";
// import { useRouter } from "next/navigation";

// const BusinessNavbar = () => {
//   const navbarCollapseRef = useRef(null);
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         navbarCollapseRef.current &&
//         !navbarCollapseRef.current.contains(event.target)
//       ) {
//         const bsCollapse = new window.bootstrap.Collapse(
//           navbarCollapseRef.current,
//           {
//             toggle: false,
//           }
//         );
//         bsCollapse.hide();
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   const placeholderTexts = [
//     "Search for plumbers...",
//     "Find the best tutors...",
//     "Looking for car services?",
//     "Explore wedding planners...",
//     "Find electricians near you...",
//   ];
//   const [placeholderIndex, setPlaceholderIndex] = useState(0);
//   const [animatedText, setAnimatedText] = useState("");

//   useEffect(() => {
//     let charIndex = 0;
//     const interval = setInterval(() => {
//       setAnimatedText(placeholderTexts[placeholderIndex].slice(0, charIndex));
//       charIndex++;
//       if (charIndex > placeholderTexts[placeholderIndex].length) {
//         clearInterval(interval);
//         setTimeout(() => {
//           setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
//         }, 1500);
//       }
//     }, 100);
//     return () => clearInterval(interval);
//   }, [placeholderIndex]);


//   const handleSearch = async () => {
//     if (!location?.pincode || !searchText.trim()) {
//       alert("Please wait for location and enter a search term.");
//       return;
//     }

//     // try {
//     //   const res = await axios.get("https://api.biziffy.com/api/search", {
//     //     params: {
//     //       query: searchText.trim(),
//     //       pincode: location.pincode,
//     //     },
//     //   });

//     router.push(`/pages/bussiness-listing?query=${searchText.trim()}&pincode=${location.pincode}`);
//     // } catch (err) {
//     //   console.error("Search failed", err);
//     //   alert("Search failed. Try again later.");
//     // }
//   };

//   return (
//     <>
//       <section className="business-navbar">
//         <nav className="navbar navbar-expand-lg">
//           <div className="container-fluid">
//             <Link className="navbar-brand" href="/">
//               <Image src={logo} alt="logo" />
//             </Link>

//             {/* Desktop search bar */}
//             <div className="d-none d-lg-flex business-navbar-search-container">
//               <div className="hero-location-select">
//                 <UserLocation location={location} setLocation={setLocation} />
//               </div>
//               <input
//                 type="text"
//                 className="hero-search-input"
//                 onChange={(e) => setSearchText(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault(); // prevent form submission if inside form
//                     if (searchText.trim() && location?.pincode) {
//                       router.push(`/pages/bussiness-listing?query=${searchText?.trim()}&pincode=${location.pincode}`);
//                     } else {
//                       alert("Please enter search text and allow location.");
//                     }
//                   }
//                 }}
//                 placeholder={animatedText}
//               />
//               <button className="hero-search-btn" onClick={handleSearch}>
//                 <i className="bi bi-search"></i>
//               </button>
//             </div>

//             {/* Mobile search icon */}
//             <div className="d-flex gap-3 d-lg-none">
//               <button
//                 className="d-lg-none btn btn-link  p-0 ms-2"
//                 onClick={() => setShowMobileSearch(!showMobileSearch)}
//               >
//                 <i className="bi bi-search fs-4"></i>
//               </button>

//               <button
//                 className="navbar-toggler"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#navbarSupportedContent"
//                 aria-controls="navbarSupportedContent"
//                 aria-expanded="false"
//                 aria-label="Toggle navigation"
//               >
//                 <span>
//                   <i className="bi bi-list text-white"></i>
//                 </span>
//               </button>
//             </div>

//             <div
//               className="collapse navbar-collapse justify-content-end"
//               id="navbarSupportedContent"
//               ref={navbarCollapseRef}
//             >
//               <div className="d-flex align-items-center ">
//                 <Link
//                   href="/pages/login"
//                   className="btn btn bg-primary text-white me-2"
//                 >
//                   SignIn
//                 </Link>
//                 <Link
//                   href="/pages/signup"
//                   className="btn btn bg-dark text-white me-2"
//                 >
//                   Register
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </nav>
//       </section>

//       {/* Mobile search dropdown */}
//       {showMobileSearch && (
//         <div className="mobile-search-slide animate__animated animate__slideInDown">
//           <div className="container-fluid d-flex flex-column bg-white p-3 shadow">
//             <div className="form-select mb-2">
//               <UserLocation />
//             </div>
//             <div className="d-flex">
//               <input
//                 type="text"
//                 className="form-control me-2"
//                 placeholder={animatedText}
//               />
//               <button className="btn btn-primary">
//                 <i className="bi bi-search"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default BusinessNavbar;


"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../Images/logo.jpg";
import UserLocation from "../UserLocation/UserLocation";
import { useRouter } from "next/navigation";
import "../Navbar/navbar.css";
import "./businessNavbar.css";
import "../Hero/hero.css";
import { getData } from "../../services/FetchNodeServices";

const placeholderTexts = [
  "Search for plumbers...",
  "Find the best tutors...",
  "Looking for car services?",
  "Explore wedding planners...",
  "Find electricians near you...",
];

const BusinessNavbar = () => {
  const router = useRouter();
  const navbarCollapseRef = useRef(null);

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [location, setLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animatedText, setAnimatedText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pinCodes, setPinCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [categoryList, setCategoryList] = useState([])
  const [subCategoryList, setSubCategoryList] = useState([])
  const [avatarUrl, setAvatarUrl] = useState(null); // holds the image URL
  const [imgError, setImgError] = useState(false);  // triggers fallback if the img fails
  const [userProfile, setUserprofile] = useState("");
  const [localLocation, setLocalLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [token, setToken] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("biziffyUser"));
    setUserprofile(storedUser?.profileImage);
    if (storedUser?.image) { setAvatarUrl(storedUser?.profileImage) }
  }, []);

  const showFallback = !avatarUrl || imgError;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pin codes
        // const pinCodeRes = await getData("pincode/get-all-pin-codes");
        // if (pinCodeRes?.status && Array.isArray(pinCodeRes?.pinCodes)) {
        //   setPinCodes(pinCodeRes.pinCodes);
        // }

        // Fetch categories
        const categoryRes = await getData("categories");
        const categoryNames = Array.isArray(categoryRes)
          ? categoryRes.map((cat) => cat?.name || "")
          : [];

        // Fetch subcategories
        const subCategoryRes = await getData("admin/subcategories");
        const subCategoryNames = Array.isArray(subCategoryRes)
          ? subCategoryRes.map((cat) => cat?.name || "")
          : [];

        // Merge categoryNames and subCategoryNames
        const mergedCategoryList = [...categoryNames, ...subCategoryNames];

        // Set the merged list in state
        setCategoryList(mergedCategoryList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchPinCodes = async (search = searchLocation || localLocation?.stateName || localLocation?.state || selectedLocation?.stateName || selectedLocation?.state || "", page = 1) => {
    setLoading(true);
    try {
      const url = `pincode/get-All-PinCodesWith-Pagination?search=${search}&limit=100&page=${page}`;
      const res = await getData(url);
      // console.log('re===>>s', res)
      if (res.status) {
        if (page === 1) {
          // const areaList = res?.pinCodes?.map(u => `${u.pinCode}`) || [];
          // setPinCodes(areaList);
          setPinCodes(res.pinCodes || []);
        } else {
          // const areaList = res?.pinCodes?.map(u => `${u.area} ${u.pinCode}`) || [];
          // setPinCodes(areaList => [...areaList, ...(res.pinCodes || [])]);
          setPinCodes(prev => [...prev, ...(res.pinCodes || [])]);
        }
        // setTotalPages(res?.pagination?.totalPages || 1);
        // setHasMore(page < (res?.pagination?.totalPages || 1));
      } else {
        if (page === 1)
          setAreas([]);
        toast({ variant: "destructive", title: "Error", description: "Failed to load pinCodes." });
      }
    } catch (error) {
      if (page === 1)
        setAreas([]);
      toast({ variant: "destructive", title: "Error", description: "Failed to load pinCodes." });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPinCodes(searchTerm, currentPage);
  }, [currentPage, searchTerm]);



  const handleSelect = (loc) => {
    setSelectedLocation(loc);
    setLocation({ pincode: loc.pincode });
    localStorage.setItem("biziffyLocation", JSON.stringify(loc));
  };

  // Handle login state
  useEffect(() => {
    const token = localStorage.getItem("biziffyToken");
    setIsLoggedIn(!!token);
    const LDATA = localStorage.getItem("biziffyLocation");
    const Local = JSON.parse(LDATA);
    setLocalLocation(Local);
  }, []);

  useEffect(() => {
    const LDATA = localStorage.getItem("biziffyLocation");
    const Local = JSON.parse(LDATA);
    setLocalLocation(Local);
  }, [location, selectedLocation]);

  const handleLogout = () => {
    localStorage.removeItem("biziffyToken");
    localStorage.removeItem("biziffyUser");
    setIsLoggedIn(false);
    router.push("/pages/login");
    window.location.href = "/pages/login";
  };

  // Collapse outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navbarCollapseRef.current &&
        !navbarCollapseRef.current.contains(event.target)
      ) {
        const bsCollapse = new window.bootstrap.Collapse(navbarCollapseRef.current, {
          toggle: false,
        });
        bsCollapse.hide();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Typing animation effect
  useEffect(() => {
    let charIndex = 0;
    const interval = setInterval(() => {
      setAnimatedText(placeholderTexts[placeholderIndex].slice(0, charIndex));
      charIndex++;
      if (charIndex > placeholderTexts[placeholderIndex].length) {
        clearInterval(interval);
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
        }, 1500);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [placeholderIndex]);

  useEffect(() => {
    if (!searchText.trim()) return setSuggestions([]);
    // const filtered = categoryList.filter((item) =>
    //   item?.toLowerCase().includes(searchText.toLowerCase())
    // );
    const filtered = categoryList?.filter((item) =>
      item?.toLowerCase()?.startsWith(searchText?.toLowerCase())
    );
    setSuggestions(filtered);
  }, [searchText]);

  const handleClearLocation = () => {
    setSelectedLocation(null);
    setLocation(null);
  };

  const handleSuggestionClick = (item) => {
    setSearchText(item);
    setSuggestions([]);
    handleSearch(item);
  };

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setLocation({ pincode: loc.pinCode });
    localStorage.setItem("biziffyLocation", JSON.stringify(loc));
  };

  const handleSearch = (manualText) => {
    const keyword = manualText || searchText;
    const pincode = localLocation ? localLocation?.pincode || localLocation?.pinCode : selectedLocation?.pinCode || location?.pincode;
    const state = localLocation ? localLocation?.state || localLocation?.stateName : selectedLocation?.stateName || location?.state;
    if (!pincode || !searchText.trim()) {
      alert("Please wait for location and enter a search term.");
      return;
    }

    const slugify = (text) => text.toLowerCase().trim().replace(/,/g, "--").replace(/&/g, "and").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

    router.push(
      `/pages/bussiness-listing/${pincode}/${slugify(state || "state")}/${slugify(keyword)}`
    );
  };

  const filteredLocations = pinCodes?.filter((loc) => {
    const search = searchTerm?.toLowerCase();
    return (
      loc?.stateName?.toLowerCase().includes(search) ||
      loc?.area?.toLowerCase().includes(search) ||
      loc?.pincode?.toString().includes(search)
    );
  });
  useEffect(() => {
    const storedData = localStorage.getItem('biziffyToken');
    setToken(storedData)
  }, []);


  const truncateLocation = (text) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.length <= 3 ? text : `${words.slice(0, 3).join(" ")}...`;
  };


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
          console.log("Detected location response:", response);

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
            setSelectedLocation(null);
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

  return (
    <>
      <section className="business-navbar">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand" href="/">
              <p className="logo-text">
                Bizi<span>ff</span>y{" "}
              </p>
            </Link>

            {/* Desktop search */}
            <div className="d-none d-lg-flex business-navbar-search-container">
              <div className="dropdown" style={{ borderRight: "1px solid #ccc" }}>
                <button
                  className="location-dropdown"
                  type="button"
                  id="locationDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  {selectedLocation ? (
                    `${selectedLocation?.area || selectedLocation?.city}, ${selectedLocation.stateName || selectedLocation.state}`
                  ) : (<>
                    {localLocation ? truncateLocation(`${localLocation?.area || localLocation?.city} ${localLocation.stateName || localLocation.state}`) : <UserLocation location={location} setLocation={setLocation} />}
                  </>
                  )}
                </button>

                <ul className="dropdown-menu home-select-location p-3 location-dropdown" aria-labelledby="locationDropdown">
                  <div onClick={handleDetectLocation} style={{ cursor: "pointer", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", }}>
                    <i className="bi bi-geo-alt-fill me-1"></i> Detect My Location
                  </div>
                  <li>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Search location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </li>
                  <li className="dropdown-section-title d-flex justify-content-between">
                    RECENT LOCATIONS
                    <span className="text-danger fw-normal" style={{ cursor: "pointer" }} onClick={handleClearLocation}>
                      Clear All
                    </span>
                  </li>
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((loc, i) => (
                      <li key={i}>
                        <button className="dropdown-item px-0" onClick={() => handleSelect(loc)}>
                          <i className="bi bi-arrow-bar-right text-black text-center me-2"></i>{" "} {loc.area}, {loc.stateName}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted px-2">No matching locations</li>
                  )}
                </ul>
              </div>
              <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  className="hero-search-input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(null)}
                  placeholder={animatedText}
                />
                {suggestions?.length > 0 && (
                  <ul className="suggestions-dropdown">
                    {suggestions?.map((item, i) => (
                      <li key={i} onClick={() => handleSuggestionClick(item)}>
                        <i className="bi bi-search me-2"></i> {item}
                      </li>
                    ))}
                  </ul>
                )}
                <button className="hero-search-btn" onClick={(e) => handleSearch(null)} aria-label="Search">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
            {/* Mobile toggle */}
            <div className="nav-m">
              <div className="d-flex gap-3 d-lg-none">
                <button className="btn btn-link p-0" onClick={() => setShowMobileSearch(!showMobileSearch)} aria-label="Toggle search">
                  <i className="bi bi-search fs-4"></i>
                </button>

                {/* <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i className="bi bi-list text-white"></i>
              </button> */}
              </div>

              {/* Right profile */}
              {!isLoggedIn ? (
                <div className="d-flex align-items-center">
                  <Link href="/pages/login" className="btn btn bg-primary text-white me-2">
                    SignIn
                  </Link>
                  <Link href="/pages/signup" className="btn btn bg-dark text-white me-2">
                    Register
                  </Link>
                </div>
              ) : (
                <div className="dropdown">
                  <button
                    className="border-0 d-flex align-items-center"
                    type="button"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ backgroundColor: "transparent" }}
                  >
                    {imgError || !userProfile ? (
                      <i className="bi bi-person-circle fs-3 text-dark" />
                    ) : (
                      <img
                        src={userProfile}
                        alt="Profile"
                        onError={() => setImgError(true)}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" aria-labelledby="profileDropdown" style={{ minWidth: "150px" }}>
                    <li>
                      <Link href="/pages/Profile" className="dropdown-item d-flex align-items-center gap-2">
                        <i className="bi bi-person"></i> Dashboard
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>
      </section>

      {/* Mobile search bar */}
      {showMobileSearch && (
        <div className="mobile-search-slide animate__animated animate__slideInDown">
          <div className="container-fluid d-flex flex-column bg-white p-3 shadow">
            <div className="mobile-searchh-locationn" onClick={() => setSearchPage(true)}>
              <div className="dropdown">
                <button
                  onClick={() => setSearchPage(true)}
                  className="location-dropdown"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  {selectedLocation ? (
                    `${selectedLocation.area || selectedLocation.city}, ${selectedLocation.stateName || selectedLocation.state}`
                  ) : (
                    <>
                      {localLocation ? (
                        truncateLocation(
                          `${localLocation?.area || localLocation?.city}, ${localLocation?.stateName || localLocation?.state}`
                        )
                      ) : (
                        <UserLocation
                          location={location}
                          setLocation={setLocation}
                        />
                      )}
                    </>
                  )}
                </button>

                <ul className="dropdown-menu home-select-location p-3 location-dropdown">
                  <div
                    onClick={handleDetectLocation}
                    style={{
                      cursor: "pointer",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i className="bi bi-geo-alt-fill me-1"></i> Detect My
                    Location
                  </div>

                  <li>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Search location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </li>

                  <li className="dropdown-section-title d-flex justify-content-between">
                    RECENT LOCATIONS
                    <span
                      className="text-danger fw-normal"
                      style={{ cursor: "pointer" }}
                      onClick={handleClearLocation}
                    >
                      Clear All
                    </span>
                  </li>
                  {filteredLocations.length ? (
                    filteredLocations.map((loc, i) => (
                      <li className="search-filter-locaions" key={i}>
                        <button
                          className="dropdown-item  px-0 py-1"
                          onClick={() => handleSelectLocation(loc)}
                        >
                          <i className="bi bi-arrow-bar-right py-1 text-black text-center me-2"></i>{" "}
                          {loc.area}, {loc.stateName}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted px-2">
                      No matching locations
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <i className="bi bi-caret-down"></i>
              </div>
            </div>
            <div className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(null)}
                placeholder={animatedText}
              />

              {suggestions.length > 0 && (
                <ul className="suggestions-dropdown">
                  {suggestions.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => handleSuggestionClick(item)}
                      className="suggestionItem"
                    >
                      <i className="bi bi-arrow-bar-right text-black text-center me-2"></i>{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              <button className="btn btn-primary" onClick={(e) => handleSearch(null)} aria-label="Search">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessNavbar;
