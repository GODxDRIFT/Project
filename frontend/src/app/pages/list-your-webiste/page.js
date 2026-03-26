"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Head from "next/head";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "../../services/FetchNodeServices";
import styles from "./module.css";

const BusinessListingPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [input, setInput] = useState("");
  const [areas, setAreas] = useState([]);
  const [serviceAreaInput, setServiceAreaInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  const [subCategoryList, setSubCategoryList] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [subCategorySearchText, setSubCategorySearchText] = useState("");
  const [showSubCategorySuggestions, setShowSubCategorySuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({ service: [] });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("biziffyUser") || "{}");
    if (user._id) {
      setFormData(prev => ({ ...prev, userId: user._id }));
    }
  }, []);

  useEffect(() => {
    getData("categories").then(data => { setCategoryList(data); setFilteredCategories(data); })
      .catch(console.error);

    // getData("pincode/get-all-pin-codes").then(res => { const areaList = res?.pinCodes?.map(u => `${u.area} ${u.pinCode}`) || []; setAreas(areaList); }).catch(console.error);
  }, []);

  const fetchPinCodes = async (search = searchLocation || localLocation?.stateName || localLocation?.state || selectedLocation?.stateName || selectedLocation?.state || "", page = 1) => {
    setLoading(true);
    try {
      const url = `pincode/get-All-PinCodesWith-Pagination?search=${search}&limit=10&page=${page}`;
      const res = await getData(url);
      // console.log('re===>>s', res)
      if (res.status) {
        if (page === 1) {
          const areaList = res?.pinCodes?.map(u => `${u.area} ${u.pinCode}`) || [];
          setAreas(areaList);
          // setPinCodes(res.pinCodes || []);
        } else {
          const areaList = res?.pinCodes?.map(u => `${u.area} ${u.pinCode}`) || [];
          setAreas(areaList => [...areaList, ...(res.pinCodes || [])]);
          // setPinCodes(prev => [...prev, ...(res.pinCodes || [])]);
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
    fetchPinCodes(serviceAreaInput, currentPage);
  }, [currentPage, serviceAreaInput]);


  useEffect(() => {
    if (formData.category) {
      getData(`admin/get-Subcategories-by-category/${formData.category}`)
        .then(data => {
          setSubCategoryList(data);
          setFilteredSubCategories(data);
        })
        .catch(console.error);
    }
  }, [formData.category]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddService = () => {
    const trimmed = input.trim();
    if (trimmed && !formData.service.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        service: [...prev.service, trimmed],
      }));
      setInput("");
    }
  };

  const removeService = idx => {
    setFormData(prev => ({
      ...prev,
      service: prev.service.filter((_, i) => i !== idx),
    }));
  };

  const handleNextStep = e => {
    e.preventDefault();
    const { companyName, shortDescription, logo, service } = formData;
    if (!companyName || companyName.length < 2) {
      return toast.error("Company name must be at least 2 characters.");
    }
    if (!shortDescription || shortDescription.length < 10) {
      return toast.error("Short description must be at least 10 characters.");
    }
    if (!logo) {
      return toast.error("Please upload a logo.");
    }
    if (!service.length) {
      return toast.error("Please add at least one service.");
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = async e => {
    e.preventDefault();
    const { companyName, website, category, categoryName, subCategory, subCategoryNames, serviceArea, shortDescription, logo, userId, service, } = formData;

    if (!category) return toast.error("Please select a category.");
    if (!subCategory || !subCategory.length) {
      return toast.error("Please select at least one sub-category.");
    }
    if (!serviceArea || !serviceArea.length) {
      return toast.error("Please enter at least one service area.");
    }

    setLoading(true);
    try {
      const step1 = new FormData();
      Object.entries({ userId, companyName, website, shortDescription }).forEach(([k, v]) =>
        v && step1.append(k, v)
      );
      service.forEach(s => step1.append("service[]", s));
      logo && step1.append("logo", logo);

      const res1 = await postData("admin/createListing", step1);
      if (res1?.status) {
        const listingId = res1.data?._id;
        const step2 = new FormData();
        step2.append("listingId", listingId);
        step2.append("category", category);
        step2.append("categoryName", categoryName);
        subCategory.forEach(s => step2.append("subCategory[]", s));
        subCategoryNames.forEach(n => step2.append("subCategoryName[]", n));
        serviceArea.forEach(a => step2.append("serviceArea[]", a));

        const res2 = await postData("admin/createAdditionalInformation", step2);
        if (res2?.status) {
          toast.success("Business listing created successfully!");
          setFormData({ service: [] });
          setStep(1);
        } else {
          toast.error(res2?.message || "Step 2 submission failed.");
        }
      } else {
        toast.error(res1?.message || "Step 1 creation failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during submission.");
    } finally {
      setLoading(false);
    }
  };

  const filterList = (list, text) =>
    list.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));

  const filteredAreas = areas.filter(
    area => area.toLowerCase().includes(serviceAreaInput.toLowerCase()) &&
      !(formData.serviceArea || []).includes(area)
  );

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <Head>
        <title>List Your Business | Business Directory</title>
      </Head>
      <div className={`container py-3 ${styles.businessPage}`}>
        <div className="row g-5">
          <div className="col-lg-6">
            <ul className="nav nav-pills mb-4">
              <li className="nav-item">
                <span className={`nav-link ${step === 1 ? "active" : ""}`}>
                  <i className="bi bi-pencil-square me-2" /> Business Info
                </span>
              </li>
              <li className="nav-item">
                <span className={`nav-link ${step === 2 ? "active" : ""}`}>
                  <i className="bi bi-check2-circle me-2" /> Additional Info
                </span>
              </li>
            </ul>

            {step === 1 && (
              <form onSubmit={handleNextStep}>
                <h4 className="text-primary mb-4">Step 1: Business Information</h4>
                {[
                  { label: "Company Name", name: "companyName" },
                  { label: "Website", name: "website" },
                  { label: "Short Description", name: "shortDescription" },
                ].map(({ label, name }) => (
                  <div className="mb-3" key={name}>
                    <label>{label}</label>
                    <input
                      className="form-control"
                      type="text"
                      value={formData[name] || ""}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, [name]: e.target.value }))
                      }
                    />
                  </div>
                ))}

                <div className="mb-3">
                  <label>Services (Press Enter to add)</label>
                  <div className="d-flex">
                    <input
                      className="form-control"
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") handleAddService();
                      }}
                    />
                    {isMobile && (
                      <button
                        type="button"
                        style={{ marginLeft: '10px' }}
                        className="btn btn-primary"
                        onClick={() => {
                          if (typeof input === "string") {
                            const newService = input.trim();
                            if (newService && !formData.service.includes(newService)) {
                              setFormData(prev => ({
                                ...prev,
                                service: [...prev.service, newService],
                              }));
                              setInput("");
                            }
                          } else {
                            console.warn("Input is not a string:", input);
                          }
                        }}
                      >
                        +
                      </button>
                    )}
                  </div>
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {formData.service.map((s, i) => (
                      <span className="badge bg-primary" key={i}>
                        {s}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          onClick={() => removeService(i)}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label>Business Logo</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      logo: e.target.files?.[0],
                    }))}
                  />
                </div>

                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? "Processing…" : "Continue to Next Step"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleFinalSubmit}>
                <h4 className="text-success mb-4">Step 2: Additional Information</h4>

                {/* Category Autocomplete */}
                <div className="mb-3 position-relative">
                  <label htmlFor="category">Category</label>
                  <input
                    id="category"
                    type="text"
                    className="form-control"
                    onFocus={() => setShowCategorySuggestions(true)}
                    onChange={e => {
                      filterList(categoryList, e.target.value);
                      setFilteredCategories(filterList(categoryList, e.target.value));
                      setShowCategorySuggestions(true);
                    }}
                    value={
                      categoryList.find(c => c._id === formData.category)?.name || ""
                    }
                  />
                  {showCategorySuggestions && (
                    <ul className="list-group position-absolute w-100 z-3">
                      {filteredCategories.map(cat => (
                        <li
                          key={cat._id}
                          className="list-group-item list-group-item-action"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              category: cat._id,
                              categoryName: cat?.name,
                            }));
                            setShowCategorySuggestions(false);
                          }}>
                          {cat.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Subcategory Multi-Select */}
                <div className="mb-3 position-relative">
                  <label>Subcategory</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type to search…"
                    onFocus={() => setShowSubCategorySuggestions(true)}
                    onChange={e => {
                      filterList(subCategoryList, e.target.value);
                      setFilteredSubCategories(
                        filterList(subCategoryList, e.target.value)
                      );
                      setSubCategorySearchText(e.target.value);
                      setShowSubCategorySuggestions(true);
                    }}
                    value={subCategorySearchText}
                  />
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {(formData.subCategoryNames || []).map((name, i) => (
                      <span className="badge bg-primary" key={i}>
                        {name}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          onClick={() => {
                            const ids = formData.subCategory.filter((_, idx) => idx !== i);
                            const names = formData.subCategoryNames.filter((_, idx) => idx !== i);
                            setFormData(prev => ({ ...prev, subCategory: ids, subCategoryNames: names }));
                          }}
                        />
                      </span>
                    ))}
                  </div>
                  {showSubCategorySuggestions && (
                    <ul className="list-group position-absolute w-100 z-3">
                      {filteredSubCategories.map(sub => (
                        <li
                          key={sub._id}
                          className="list-group-item list-group-item-action"
                          onClick={() => {
                            if (!(formData.subCategory || []).includes(sub._id)) {
                              setFormData(prev => ({
                                ...prev,
                                subCategory: [...(prev.subCategory || []), sub._id],
                                subCategoryNames: [...(prev.subCategoryNames || []), sub.name],
                              }));
                              setSubCategorySearchText("");
                            }
                            setShowSubCategorySuggestions(false);
                          }}>
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Service Area / Pincode Autocomplete */}
                <div className="mb-3 position-relative">
                  <label>Service Area / Pincode</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Area / Pincode"
                    value={serviceAreaInput}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={e => setServiceAreaInput(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  {showSuggestions && filteredAreas.length > 0 && (
                    <ul className="list-group position-absolute w-100 z‑3">
                      {filteredAreas.map(area => (
                        <li
                          key={area}
                          className="list-group-item list-group-item-action"
                          onMouseDown={() => {
                            setFormData(prev => ({
                              ...prev,
                              serviceArea: [...(prev.serviceArea || []), area],
                            })),
                              setShowSuggestions(false);
                          }
                          }>
                          {area}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {(formData.serviceArea || []).map((area, i) => (
                      <span className="badge bg-primary" key={i}>
                        {area}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              serviceArea: prev.serviceArea.filter((_, idx) => idx !== i),
                            }));
                          }}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button className="btn btn-success" type="submit" disabled={loading}>
                    {loading ? "Submitting…" : "Submit Listing"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="col-lg-6">
            <div className={styles.infoSection}>
              {[
                {
                  icon: "megaphone-fill",
                  title: "Boost Visibility",
                  desc: "Get seen by more customers.",
                  color: "primary",
                },
                {
                  icon: "bar-chart-line-fill",
                  title: "SEO Optimized",
                  desc: "Better search engine presence.",
                  color: "success",
                },
                {
                  icon: "gear-fill",
                  title: "Easy Management",
                  desc: "Update anytime.",
                  color: "warning",
                },
                {
                  icon: "shield-check",
                  title: "Build Trust",
                  desc: "Verified buyers trust listings.",
                  color: "info",
                },
                {
                  icon: "geo-alt-fill",
                  title: "Reach Locals",
                  desc: "Localized discovery.",
                  color: "danger",
                },
              ].map((item, idx) => (
                <div className={`mb-4 p-3 shadow-sm bg-white rounded ${styles.infoCard}`} key={idx}>
                  <h5>
                    <i className={`bi bi-${item.icon} me-2 text-${item.color}`}></i>
                    {item.title}
                  </h5>
                  <p className="m-0">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessListingPage;
