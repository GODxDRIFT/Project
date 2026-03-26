"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserLocation from "../UserLocation/UserLocation";
import { getData } from "../../services/FetchNodeServices";
import "./hero.css";
import path from "path";

const Hero = () => {
  const router = useRouter();

  const [location, setLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [pinCodes, setPinCodes] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [token, setToken] = useState(null);
  const [localLocation, setLocalLocation] = useState(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animatedText, setAnimatedText] = useState("");
  const [searchPage, setSearchPage] = useState(false);
  const [Ditacting, setDitacting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const placeholderTexts = [
    "Search for plumbers...",
    "Find the best tutors...",
    "Looking for car services?",
    "Explore wedding planners...",
    "Find electricians near you...",
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoryRes = await getData("categories");
        const categoryNames = Array.isArray(categoryRes)
          ? categoryRes.map((cat) => cat?.name || "")
          : [];
        // Fetch subcategories
        const subCategoryRes = await getData("admin/subcategories");
        const subCategoryNames = Array.isArray(subCategoryRes)
          ? subCategoryRes.map((cat) => cat?.name || "")
          : [];

        const mergedCategoryList = [...categoryNames, ...subCategoryNames];

        setCategoryList(mergedCategoryList);

        const listings = await getData("get-all-listings");
        const listingNames = listings?.data?.map(
          (l) => l?.businessDetails?.businessName
        );
        // You can use this `listingNames` if needed for extended search
      } catch (err) {
        console.error("Error fetching categories or listings", err);
      }
    };

    fetchInitialData();
    const LDATA = localStorage.getItem("biziffyLocation");
    const Local = JSON.parse(LDATA);
    setLocalLocation(Local);
  }, []);

  // useEffect(() => {
  //   const fetchPinCodes = async () => {
  //     try {
  //       const response = await getData("pincode/get-all-pin-codes");
  //       if (response?.status) {
  //         setPinCodes(response?.pinCodes);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching pin codes", err);
  //     }
  //   };

  //   fetchPinCodes();
  // }, []);


  const fetchPinCodes = async (search = searchLocation || localLocation?.stateName || localLocation?.state || selectedLocation?.stateName || selectedLocation?.state || "", page = 1) => {
    setLoading(true);
    try {
      const url = `pincode/get-All-PinCodesWith-Pagination?search=${search}&limit=800&page=${page}`;
      const res = await getData(url);
      // console.log('re===>>s', res)
      if (res.status) {
        if (page === 1) {
          setPinCodes(res.pinCodes || []);
        } else {
          setPinCodes(prev => [...prev, ...(res.pinCodes || [])]);
        }
        setTotalPages(res?.pagination?.totalPages || 1);
        // setHasMore(page < (res?.pagination?.totalPages || 1));
      } else {
        if (page === 1) setPinCodes([]);
        toast({ variant: "destructive", title: "Error", description: "Failed to load pinCodes." });
      }
    } catch (error) {
      if (page === 1) setPinCodes([]);
      toast({ variant: "destructive", title: "Error", description: "Failed to load pinCodes." });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPinCodes(searchLocation, currentPage);
  }, [currentPage, searchLocation]);

  useEffect(() => {
    if (!searchText.trim()) return setSuggestions([]);
    // const filtered = categoryList.filter((item) =>
    //   item?.toLowerCase().includes(searchText.toLowerCase())
    // );
    const filtered = categoryList.filter((item) =>
      item?.toLowerCase().startsWith(searchText.toLowerCase())
    );
    // console.log("filtered=>>", filtered);
    // console.log("filtered=>>", categoryList);
    setSuggestions(filtered);
  }, [searchText]);

  useEffect(() => {
    let charIndex = 0;
    const text = placeholderTexts[placeholderIndex];
    const interval = setInterval(() => {
      setAnimatedText(text.slice(0, charIndex++));
      if (charIndex > text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
        }, 1500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [placeholderIndex]);

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

  const handleClearLocation = () => {
    setSelectedLocation(null);
    setLocation(null);
  };

  const handleSearch = (manualText) => {
    const keyword = manualText || searchText;
    const pincode = localLocation ? selectedLocation?.pinCode || localLocation?.pincode || localLocation?.pinCode : selectedLocation?.pinCode || location?.pincode || location?.pinCode;
    const state = localLocation ? selectedLocation?.stateName || localLocation?.stateName || localLocation?.state : selectedLocation?.stateName || location?.state;

    if (!pincode || !keyword?.trim()) {
      alert("Please wait for location and enter a search term.");
      return;
    }

    const slugify = (text) => String(text || "")?.toLowerCase().trim().replace(/,/g, "--").replace(/&/g, "and").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

    router.push(
      `/pages/bussiness-listing/${pincode}/${slugify(state || "state")}/${slugify(keyword)}`
    );
  };

  // const filteredLocations = pinCodes.filter((loc) => {
  //   const search = searchLocation.toLowerCase();
  //   return (
  //     loc?.stateName?.toLowerCase().includes(search) ||
  //     loc?.area?.toLowerCase().includes(search) ||
  //     loc?.pincode?.toString().includes(search)
  //   );
  // });

  useEffect(() => {
    const storedData = localStorage.getItem("biziffyToken");
    setToken(storedData);
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
    setDitacting(true)
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
            setDitacting(false)
          } else {
            alert("Failed to fetch location data.");
            setDitacting(false)
          }
        } catch (error) {
          console.error("Error getting location:", error);
          alert("Something went wrong while detecting your location.");
          setDitacting(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Permission denied or unable to access your location.");
        setDitacting(false)
      }
    );
  };
  // console.log("GGG:==>DDDDDD", searchLocation?.stateName, selectedLocation?.stateName, location?.stateName, localLocation?.stateName)
  return (
    <section className="some-page-hero-bg">
      <div className="container">
        <div className="hero-main">
          <div className="row m-0 p-0">
            <div className="col-md-12 m-0">
              <div className="hero-content">
                <h1 className="hero-title">
                  We are connecting! <span>Hold On</span> your success is near.
                </h1>

                {/* Search Bar */}
                <div className="hero-search-bar">
                  <div className="hero-search-container">
                    {/* Location Dropdown */}
                    <div
                      className="dropdown"
                      style={{ paddingRight: "2px", borderRight: "1px solid #ccc", }}>
                      <button onClick={() => setSearchPage(true)} className="location-dropdown" data-bs-toggle="dropdown">
                        <i className="bi bi-geo-alt me-2"></i>
                        {selectedLocation ? (
                          `${selectedLocation?.area}, ${selectedLocation?.stateName}`
                        ) : (
                          <>
                            {localLocation ? (Ditacting ? "Detecting Location..." :
                              truncateLocation(
                                `${localLocation?.city || localLocation?.area} ${localLocation?.state || localLocation?.stateName}`
                              )
                            ) : (
                              <UserLocation location={location} setLocation={setLocation} />
                            )}
                          </>
                        )}
                      </button>

                      <ul className="dropdown-menu home-select-location p-3 location-dropdown">
                        <div
                          onClick={handleDetectLocation}
                          style={{ cursor: "pointer", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", }}>
                          <i className="bi bi-geo-alt-fill me-1"></i> {Ditacting ? 'Detecting Location...' : 'Detect My Location'}
                        </div>

                        <li>
                          <input type="text" className="form-control mb-2" placeholder="Search location..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
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
                        {pinCodes.length ? (
                          pinCodes.map((loc, i) => (
                            <li className="search-filter-locaions" key={i}>
                              <button
                                className="dropdown-item px-0"
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

                    {/* Category Input */}
                    <div style={{ position: "relative", width: "100%" }}>
                      <input type="text" className="hero-search-input" value={searchText} onClick={() => setSearchPage(true)} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch(null)} placeholder={animatedText || "Search categories..."} />
                      {suggestions.length > 0 && (
                        <ul className="suggestions-dropdown d-none d-lg-block">
                          <p className="m-0 text-dark">Trending Searches</p>
                          {suggestions.map((item, i) => (
                            <li
                              key={i}
                              onClick={() => handleSuggestionClick(item)}
                              className="suggestionItem"
                            >
                              <span
                                style={{ marginRight: "5px" }}
                                className="search-suggestions"
                              >
                                {" "}
                                <i className="bi bi-arrow-bar-right ps-2 pe-2 py-1"></i>{" "}
                              </span>{" "}
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Search Button */}
                    <button className="hero-search-btn" onClick={(e) => handleSearch(null)}>
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>

                {/* search page ////////////////// */}
                {searchPage && (
                  <div className="search-page-main">
                    <div className="search-page-top">
                      <div className="search-page-div-1">
                        <Link
                          onClick={() => setSearchPage(false)}
                          href="#"
                          className="search-page-link text-decoration-none"
                        >
                          <i className="bi bi-chevron-left">Back</i>
                        </Link>
                      </div>
                      <div className="search-page-div-2">
                        <div
                          className="dropdown"
                          style={{ paddingRight: "2px" }}
                        >
                          <button
                            className="location-dropdown"
                            data-bs-toggle="dropdown"
                          >
                            <i className="bi bi-geo-alt me-2"></i>
                            {selectedLocation ? (
                              `${selectedLocation?.area}, ${selectedLocation?.stateName}`
                            ) : (
                              <>
                                {localLocation ? (Ditacting ? "Detecting Location..." :
                                  truncateLocation(
                                    `${localLocation?.city || localLocation?.area} ${localLocation?.state || localLocation.stateName}`
                                  )
                                ) : (
                                  <UserLocation location={location} setLocation={setLocation} />
                                )}
                              </>
                            )}
                          </button>

                          <ul className="dropdown-menu home-select-location p-3 location-dropdown">
                            <div onClick={handleDetectLocation} style={{ cursor: "pointer", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", }}>
                              <i className="bi bi-geo-alt-fill me-1"></i> {Ditacting ? 'Detecting Location...' : 'Detect My Location'}
                            </div>

                            <li>
                              <input type="text" className="form-control mb-2" placeholder="Search location..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
                            </li>

                            <li className="dropdown-section-title d-flex justify-content-between">
                              RECENT LOCATIONS
                              <span className="text-danger fw-normal" style={{ cursor: "pointer" }} onClick={handleClearLocation}>
                                Clear All
                              </span>
                            </li>
                            {pinCodes?.length ? (
                              pinCodes?.map((loc, i) => (
                                <li key={i}>
                                  <button className="dropdown-item" onClick={() => handleSelectLocation(loc)}>
                                    <i className="bi bi-search bg-dark py-1 ps-2 pe-2 text-white text-center me-2"></i>{" "}
                                    {loc?.area}, {loc?.stateName}
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
                      </div>
                    </div>
                    <div className="search-bar-mainn">
                      <div className="search-bar-div">
                        <input type="text" className="search-bar-inputt" value={searchText} onClick={() => setSearchPage(true)} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch(null)} placeholder={animatedText || "Search categories..."} />
                        {suggestions.length > 0 && (
                          <ul className="suggestions-dropdown">
                            {suggestions.map((item, i) => (
                              <li key={i} onClick={() => handleSuggestionClick(item)} className="suggestionItem" >
                                <i className="bi bi-arrow-bar-right text-black text-center me-2"></i>{" "}
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                        <span className="search-icon-nav">
                          <i className="bi bi-search"></i>
                        </span>
                        <button
                          className="search-page-search-btn"
                          onClick={(e) => handleSearch(null)}
                        >
                          <i className="bi bi-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Call to Actions */}
                <div className="hero-buttons">
                  <Link href={{ pathname: token ? "/pages/list-your-webiste" : "/pages/login", query: { message: "/pages/list-your-webiste" }, }} className="herobutton1"                  >
                    List Your Website
                  </Link>
                  <Link href="/pages/freelistingform" className="herobutton2">
                    List Your Business
                  </Link>
                </div>
              </div>
            </div>

            {/* Optional image block can go here */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
