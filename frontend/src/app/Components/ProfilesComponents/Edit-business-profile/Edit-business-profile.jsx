"use client";
import React, { useState, useEffect } from "react";
import "./EditBusinessProfile.css";
import Image from "next/image";
import { getData, postData } from "../../../services/FetchNodeServices";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";               // 1️⃣  core lib
import "sweetalert2/dist/sweetalert2.min.css"; //   needed once for styling
import Select from "react-select";


export default function EditBusinessProfile({ listingId }) {
  // ====== Api Data ========
  // const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  // const [services, setServices] = useState([]);
  const [serviceInput, setServiceInput] = useState("");
  const [oldImage, setOldImage] = useState([]);
  const [serviceAreaInput, setServiceAreaInput] = useState("");
  const [areas, setAreas] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [statesList, setStatesList] = useState([])
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [citiesList, setCitiesList] = useState([{ _id: 1, name: "Mumbai" }, { _id: 2, name: "Delhi" }, { _id: 3, name: "Bengaluru" }, { _id: 4, name: "Chennai" }, { _id: 5, name: "Kolkata" }])
  const [formData, setFormData] = useState({
    businessname: "", businessCategory: "", businessSubCategory: [], services: [], businessArea: [], Building: "",
    Street: "", Area: "", Landmark: "", city: "", state: "", pincode: "", phone: "", about: "", image: null,
    images: [], email: "", experience: "", whatsapp: "", websiteURL: "", googlemap: "", facebook: "", instagram: "",
    twitter: "", linkedin: "", faq: [{ question: "", answer: "" }], yib: '',
  });

  const [userId, setUserId] = useState(null);
  const [planData, setPlanData] = useState([]);
  const router = useRouter();

  const filteredPlanData = planData?.filter((item) => item?.businessId?.businessDetails?.businessName === listingId?.businessDetails?.businessName)
  const categories = [
    { id: "basic", label: "Basic Info", icon: "bi-person" },
    { id: "address", label: "Address", icon: "bi-geo-alt" },
    { id: "subcategory", label: "Category", icon: "bi-grid", },
    { id: "services", label: "Services", icon: "bi-briefcase" },
    { id: "servicearea", label: "Service Area", icon: "bi-map" },

    (planData?.length > 0 &&
      (filteredPlanData[0]?.planDetails?.name === "Premium" ||
        filteredPlanData[0]?.planDetails?.name === "Standard")) &&
    { id: "url", label: "Business URL", icon: "bi-link-45deg", },

    { id: "img", label: "Business Image", icon: "bi-card-image" },

    (planData?.length > 0 &&
      (filteredPlanData[0]?.planDetails?.name === "Premium" ||
        filteredPlanData[0]?.planDetails?.name === "Standard")) &&
    { id: "faq", label: "FAQ", icon: "bi-question-circle", },
  ].filter(Boolean);

  const fetchPlanData = async (userId) => {
    try {
      const response = await getData(`membership/get-all-memberships-by-user/${userId}`);
      if (response?.status === true) {
        setPlanData(response.data);
      }
    } catch (error) {
      console.error("Error fetching plan data:", error);
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("biziffyUser");
      if (!storedUser) {
        router.push("/pages/login");
        return;
      }

      const user = JSON.parse(storedUser);
      if (user?._id) {
        setUserId(user?._id);
        fetchPlanData(user?._id);
      } else {
        router.push("/pages/login");
      }
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      router.push("/pages/login");
    }
  }, [router]);


  // ----- Images ------------
  useEffect(() => {
    if (!listingId) return;

    const contact = listingId.contactPerson || {};
    const details = listingId.businessDetails || {};
    const categoryData = listingId.businessCategory || {};
    const upgrade = listingId.upgradeListing || {};

    const category = categoryData?.category || {};
    const subCategories = categoryData?.subCategory || [];
    const subCategoryName = categoryData?.subCategoryName || [];
    const categoryName = categoryData?.categoryName || "";
    const businessImages = categoryData?.businessImages || [];
    // console.log("hhhhHHHHHHHH=>", categoryName)
    // console.log("hhhhHHHHHHHH=>", subCategoryName)
    setFormData((priv) => ({ ...priv, categoryName: "categoryName", subCategoryName: "subCategoryName" }))
    setFormData((prev) => ({
      ...prev,

      // Contact Person Info
      title: contact.title || "",
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      phone: contact.contactNumber || "",
      whatsapp: contact.whatsappNumber || "",
      email: contact.email || "",

      // Business Details
      businessname: details.businessName || "",
      Building: details.building || "",
      Street: details.street || "",
      Area: details.area || "",
      Landmark: details.landmark || "",
      city: details.city || "",
      state: details.state || "",
      pincode: details.pinCode || "",
      yib: details.yib || "",
      status: details.status || "",

      // Business Category
      businessCategory: category._id || "",
      categoryName: category.categoryName || "",
      businessSubCategory: subCategories.map(item => item?._id),
      subCategoryName: subCategoryName,

      // Images
      images: businessImages,
      oldImage: businessImages,

      // About & Keywords
      about: categoryData?.about || "",
      services: categoryData?.keywords || [],
      businessArea: categoryData?.serviceArea || [],

      // Social & Web Links
      websiteURL: upgrade.website || "",
      googlemap: upgrade.direction || "",
      facebook: upgrade.facebook || "",
      instagram: upgrade.instagram || "",
      twitter: upgrade.twitter || "",
      linkedin: upgrade.linkedin || "",

      // Experience & Misc
      experience: listingId.experience || "",
      image: null,

      // FAQs
      faq: Array.isArray(listingId.faq)
        ? listingId.faq.map((item) => ({
          question: item?.question || "",
          answer: item?.answer || "",
        }))
        : [],
    }));

    setOldImage(businessImages); // If you need to track separately

    // Optional debug
    // console.log("Form initialized with:", {
    //   subCategoryName,
    //   categoryName,
    //   subCategoryIds: subCategories.map(item => item?._id),
    // });

  }, [listingId]);


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const selectedFiles = Array.from(files);
    const planName = filteredPlanData?.[0]?.planDetails?.name || "Free";
    const currentImages = formData.images || [];

    // Set max upload limits
    const maxImages = {
      Free: 5,
      Standard: 15,
      Premium: 30,
    }[planName] || 5;

    if (name === "images") {
      const totalImages = currentImages.length + selectedFiles.length;

      if (totalImages > maxImages) {
        alert(`You can upload up to ${maxImages} images for the ${planName} plan.`);
        return;
      }

      const updatedImages = [...currentImages, ...selectedFiles];
      setFormData((prev) => ({ ...prev, images: updatedImages }));
    }

    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: selectedFiles[0] }));
    }
  };

  // ==============================
  // 🗑 Remove Individual Image
  // ==============================
  const handleRemoveImage = (index) => {
    const updatedImages = [...(formData.images || [])];
    updatedImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
    setFormData((prev) => ({ ...prev, oldImage: updatedImages }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' || name === 'whatsapp' || name === 'yib') {
      const cleanedValue = value.replace(/\D/g, '');
      if (cleanedValue.length <= 10) {
        setFormData({ ...formData, [name]: cleanedValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    // Contact Person
    form.append("contactPerson[userId]", listingId?.contactPerson?.userId);
    form.append("contactPerson[title]", formData?.title);
    form.append("contactPerson[firstName]", formData?.firstName);
    form.append("contactPerson[lastName]", formData?.lastName);
    form.append("contactPerson[contactNumber]", formData?.phone);
    form.append("contactPerson[whatsappNumber]", formData?.whatsapp);
    form.append("contactPerson[email]", formData?.email);

    // Business Details
    form.append("businessDetails[businessName]", formData?.businessname);
    form.append("businessDetails[status]", formData?.status);
    form.append("businessDetails[building]", formData?.Building);
    form.append("businessDetails[street]", formData?.Street);
    form.append("businessDetails[area]", formData?.Area);
    form.append("businessDetails[landmark]", formData?.Landmark);
    form.append("businessDetails[city]", formData?.city);
    form.append("businessDetails[state]", formData?.state);
    form.append("businessDetails[pinCode]", formData?.pincode);
    form.append("businessDetails[yib]", formData?.yib);

    // Business Category
    form.append("businessCategory[category]", formData?.businessCategory);
    form.append("businessCategory[categoryName]", formData?.categoryName?.trim() || listingId?.businessCategory?.categoryName || "");

    (formData?.businessSubCategory || listingId?.businessCategory?.subCategoryName || []).forEach((id, index) => {
      form.append(`businessCategory[subCategory][${index}]`, id);
    });

    // (formData?.subCategoryName || listingId.businessCategory.subCategoryName || []).forEach((id, index) => {
    //   form.append(`businessCategory[subCategoryName][${index}]`, id);
    // });
    (formData?.subCategoryName || []).map((id, index) => {
      if (id.length > 0) {
        form.append(`businessCategory[subCategoryName][${index}]`, id);
      } else {
        form.append(`businessCategory[subCategoryName][${index}]`, listingId?.businessCategory?.subCategoryName[index]);
      }
    });

    (formData?.services || []).forEach((service, index) => {
      form.append(`businessCategory[keywords][${index}]`, service);
    });

    (formData?.services || []).forEach((service, index) => {
      form.append(`businessCategory[businessService][${index}]`, service);
    });

    (formData?.businessArea || []).forEach((area, index) => {
      form.append(`businessCategory[serviceArea][${index}]`, area);
    });

    if (formData?.faq) {
      form.append(`faq`, JSON.stringify(formData?.faq));
    }
    form.append("businessCategory[about]", formData?.about);

    // Business Images
    (formData?.images || []).forEach((img, index) => {
      if (typeof img === "string") {
        form.append("businessImages", img);
      } else if (img instanceof File) {
        form.append("businessImages", img);
      }
    });

    (formData?.oldImage || []).forEach((img, index) => {
      if (typeof img === "string") {
        form.append("businessOldImage", img);
      } else if (img instanceof File) {
        form.append("businessOldImage", img);
      }
    });

    // Upgrade Listing
    form.append("upgradeListing[direction]", formData?.googlemap);
    form.append("upgradeListing[website]", formData?.websiteURL);
    form.append("upgradeListing[facebook]", formData?.facebook);
    form.append("upgradeListing[instagram]", formData?.instagram);
    form.append("upgradeListing[linkedin]", formData?.linkedin);
    form.append("upgradeListing[twitter]", formData?.twitter);

    try {
      const response = await postData(
        `update-listings-by-id/${listingId?._id}`,
        form
      );
      if (response) {
        // success toast‑style popup
        window.location.reload();
        Swal.fire({
          icon: "success",
          title: "Profile updated successfully!",
          toast: true,            // positions it like a toast
          position: "top-end",
          timer: 2000,            // auto‑closes after 2 s
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      // fuller error dialog (keep it on screen so user can read)
      Swal.fire({
        icon: "error",
        title: "Failed to update profile",
        text: error?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleFAQChange = (e, index, field) => {
    const updatedFaq = [...formData.faq];
    updatedFaq[index][field] = e.target.value;
    setFormData({ ...formData, faq: updatedFaq });
  };

  // To add a new FAQ entry
  const handleAddFAQ = () => {
    setFormData({ ...formData, faq: [...formData?.faq, { question: "", answer: "" }] });
  };

  // To remove a specific FAQ entry
  const handleRemoveFAQ = (index) => {
    const updatedFaq = formData.faq.filter((_, i) => i !== index);
    setFormData({ ...formData, faq: updatedFaq });
  };


  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getData("categories");
        setCategoryList(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    if (formData.businessCategory) {
      const fetchSubCategory = async () => {
        try {
          const response = await getData(`admin/get-Subcategories-by-category/${formData.businessCategory}`); setSubCategoryList(response);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubCategory();
    } else {
      setSubCategoryList([]);
    }
  }, [formData.businessCategory]);

  const handleSubCategoryChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((prev) => ({ ...prev, businessSubCategory: values }));
  };

  const removeItem = (itemToRemove) => {
    setFormData((prev) => ({ ...prev, businessSubCategory: prev.businessSubCategory.filter((item) => item !== itemToRemove), }));
  };

  const handleServiceKeyDown = (e) => {
    if (e.key === "Enter" && serviceInput.trim()) {
      e.preventDefault();
      const trimmed = serviceInput.trim();
      if (!formData.services.includes(trimmed)) {
        setFormData({
          ...formData,
          services: [...formData.services, trimmed],
        });
      }
      setServiceInput("");
    }
  };

  const removeService = (indexToRemove) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== indexToRemove),
    });
  };

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await postData(`pincode/get-areapincode-by-state`, { state: formData?.state });
        const areaList = res?.map((user) => `${user?.area} ${user?.pinCode}`);
        setAreas(areaList);
        setCitiesList(res);

      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };
    fetchAreas();
  }, [formData?.state]);

  const filteredAreas = areas?.filter(
    (area) =>
      area?.toLowerCase().includes(serviceAreaInput.toLowerCase()) &&
      !formData?.businessArea.includes(area)
  );

  const handleSelectArea = (area) => {
    setFormData((prev) => ({
      ...prev,
      businessArea: [...prev.businessArea, area],
    }));
    setServiceAreaInput("");
  };

  const removeAreaItem = (value) => {
    setFormData((prev) => ({
      ...prev,
      businessArea: prev.businessArea.filter((a) => a !== value),
    }));
  };
  useEffect(() => {
    const Cname = categoryList?.find((cl) => cl?._id === formData?.businessCategory);
    const SCN = formData?.businessSubCategory?.map((id) => {
      const match = subCategoryList?.find((sc) => sc?._id === id);
      return match?.name || "";
    });

    // Update both values in one setFormData call
    setFormData((prev) => ({ ...prev, categoryName: Cname?.name || "", subCategoryName: SCN, }));
  }, [formData?.businessCategory, formData?.businessSubCategory]);

  const fetchState = async () => {
    try {
      const response = await getData("state/get-all-states");
      if (response?.status) {
        setStatesList(response?.data);
      }

    } catch (err) {
    }
  }

  useEffect(() => {
    fetchState()
  }, [])

  console.log("FFFFFF:==>", formData)
  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <form onSubmit={handleSubmit}>
            <div className="row align-items-center">
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Business Name</label>
                  <input type="text" name="businessname" value={formData?.businessname} onChange={handleChange} required />
                </div>
              </div>

              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" maxLength={10} required />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Whatsapp No.</label>
                  <input type="tel" name="whatsapp" value={formData.whatsapp} pattern="[0-9]{10}" maxLength={10} onChange={handleChange} required />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Years In Business</label>
                  <input type="text" name="yib" value={formData?.yib} onChange={handleChange} />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3 mx-3">
              Save Changes
            </button>
            <button className="btn btn-outline-secondary mt-3" onClick={() => setActiveTab("")}            >
              Cancel
            </button>{" "}
          </form>
        );

      case "address":
        return (
          <form onSubmit={handleSubmit}>
            <div className="row align-items-center">
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Building/Block No</label>
                  <input type="text" name="Building" value={formData.Building} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Street/Colony Name</label>
                  <input type="text" name="Street" value={formData.Street} onChange={handleChange} />
                </div>
              </div>
              {/* <div className="col-md-3">
                <div className="edit-profile-field">
                  <label>Area</label>
                  <input type="text" name="Area" value={formData.Area} onChange={handleChange} />
                </div>
              </div> */}
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Landmark</label>
                  <input type="text" name="Landmark" value={formData.Landmark} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              {/* <div className="col-md-3">
                <div className="edit-profile-field">
                  <label>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} />
                </div>
              </div> */}
              <div className="col-md-4">
                <div className="edit-profile-field position-relative">
                  <label className="form-label">State <sup>*</sup></label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    placeholder="Enter State"
                    value={formData.state || ""}
                    onChange={handleChange}
                    onFocus={() => setShowStateSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowStateSuggestions(false), 200)}
                    required
                  />
                  {showStateSuggestions && (
                    <ul
                      className="list-group position-absolute w-100"
                      style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
                    >
                      {statesList
                        ?.filter((state) =>
                          state?.name
                            ?.toLowerCase()
                            .includes((formData?.state || "").toLowerCase())
                        )
                        .map((state) => (
                          <li
                            key={state._id}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: "pointer" }}
                            onMouseDown={() =>
                              setFormData({ ...formData, state: state?.name })
                            }
                          >
                            <i className="bi bi-search"></i>{state?.name}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

              </div>

              <div className="col-md-4">
                <div className="edit-profile-field position-relative">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    onFocus={() => setShowCitySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                    className="form-control"
                    placeholder="Enter City"
                    required
                  />
                  {showCitySuggestions && (
                    <ul
                      className="list-group position-absolute w-100"
                      style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
                    >
                      {citiesList
                        ?.filter((city) =>
                          city?.area.toLowerCase().includes((formData.city || "").toLowerCase())
                        )
                        .map((city) => (
                          <li
                            key={city._id}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: "pointer" }}
                            onMouseDown={() =>
                              setFormData({ ...formData, city: city.area })
                            }
                          >
                            <i className="bi bi-search"></i> {city.area}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Pin Code</label>
                  <input type="tel" name="pincode" value={formData.pincode} onChange={handleChange} required />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3 mx-3">
              Save Changes
            </button>
            <button className="btn btn-outline-secondary mt-3" onClick={() => setActiveTab("")}            >
              Cancel
            </button>{" "}
          </form>
        );

      case "url":
        return (
          <form onSubmit={handleSubmit}>
            <div className="row align-items-center">
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Website URL</label>
                  <input type="url" name="websiteURL" value={formData.websiteURL} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Google Map URL</label>
                  <input type="url" name="googlemap" value={formData.googlemap} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Facebook</label>
                  <input type="url" name="facebook" onChange={handleChange} value={formData.facebook} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Instagram</label>
                  <input type="url" name="instagram" onChange={handleChange} value={formData.instagram} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Twitter</label>
                  <input type="url" name="twitter" onChange={handleChange} value={formData.twitter} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>LinkedIn</label>
                  <input type="url" name="linkedin" onChange={handleChange} value={formData.linkedin} />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3 mx-3">
              Save Changes
            </button>
            <button className="btn btn-outline-secondary mt-3" onClick={() => setActiveTab("")}            >
              Cancel
            </button>
          </form>
        );

      // case "subcategory":
      //   return (
      //     <form onSubmit={handleSubmit}>
      //       <div className="row">
      //         {/* Business Category */}
      //         <div className="col-md-12 mb-6">
      //           <label className="form-label">
      //             Business Category <sup>*</sup>
      //           </label>
      //           <select
      //             className="form-control"
      //             required
      //             value={formData?.businessCategory || ""}
      //             onChange={(e) =>
      //               setFormData({ ...formData, businessCategory: e.target.value, businessSubCategory: [] })
      //             }
      //           >
      //             <option value="">Select Your Category</option>
      //             {categoryList.map((cat) => (
      //               <option key={cat._id} value={cat._id}>
      //                 {cat.name}
      //               </option>
      //             ))}
      //           </select>
      //         </div>

      //         {/* Sub Category */}
      //         <div className="col-md-12 mb-6">
      //           <label className="form-label">
      //             Add More SubCategory <sup>*</sup>
      //           </label>
      //           <select
      //             className="form-control"
      //             required
      //             value={formData?.businessSubCategory || ""}
      //             onChange={handleSubCategoryChange}
      //           >
      //             {subCategoryList?.map((sub) => (
      //               <option key={sub?._id} value={sub?._id}>
      //                 {sub?.name}
      //               </option>
      //             ))}
      //           </select>

      //           {/* Selected badges */}
      //           <div className="mt-2">
      //             {(formData?.businessSubCategory || []).map((catId) => {
      //               const sub = subCategoryList?.find((s) => s?._id === catId);
      //               return (
      //                 <span key={catId?._id} className="badge bg-primary me-2 mb-2 p-2">
      //                   {sub?.name || catId?.name}
      //                   <button type="button" className="btn-close btn-close-white ms-2" style={{ fontSize: "0.6rem" }} onClick={() => removeItem(catId)} aria-label="Remove" />
      //                 </span>
      //               );
      //             })}
      //           </div>
      //         </div>
      //       </div>

      //       {/* Submit Buttons */}
      //       <div className="d-flex gap-3 mt-3">
      //         <button type="submit" className="btn btn-primary">
      //           Save Changes
      //         </button>
      //         <button
      //           type="button"
      //           className="btn btn-outline-secondary"
      //           onClick={() => setActiveTab("")}
      //         >
      //           Cancel
      //         </button>
      //       </div>
      //     </form>
      //   );

      case "subcategory":
        return (
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Business Category */}
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Business Category <sup>*</sup>
                </label>
                <select
                  className="form-control"
                  required
                  value={formData?.businessCategory || ""}
                  onChange={(e) => {
                    const selectedCat = categoryList.find(cat => cat._id === e.target.value);
                    setFormData({
                      ...formData,
                      businessCategory: selectedCat._id,
                      categoryName: selectedCat.name,
                      businessSubCategory: [],
                    });
                  }}
                >
                  <option value="">Select Your Category</option>
                  {categoryList.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Category - searchable + multiselect */}
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Add More SubCategory <sup>*</sup>
                </label>
                <Select
                  isMulti
                  name="businessSubCategory"
                  options={subCategoryList.map((sub) => ({ value: sub._id, label: sub.name, }))}

                  value={subCategoryList
                    .filter((sub) => (formData.businessSubCategory || []).includes(sub._id))
                    .map((sub) => ({ value: sub._id, label: sub.name, }))}

                  onChange={(selectedOptions) => {
                    const selectedIds = selectedOptions.map((opt) => opt.value);
                    setFormData((prev) => ({ ...prev, subCategoryName: selectedOptions.map((opt) => opt.label), businessSubCategory: selectedIds, }));
                  }}
                  classNamePrefix="react-select"
                />
              </div>

              {/* Selected badges (optional, react-select shows chips already) */}
              {/* You can remove this section if react-select chips are enough */}
              {/* {formData?.businessSubCategory?.length > 0 && (
                <div className="mt-2">
                  {formData.businessSubCategory.map((catId) => {
                    const sub = subCategoryList.find((s) => s._id === catId);
                    return (
                      <span key={catId} className="badge bg-primary me-2 mb-2 p-2">
                        {sub?.name || "Unknown"}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          style={{ fontSize: "0.6rem" }}
                          onClick={() => removeItem(catId)}
                          aria-label="Remove"
                        />
                      </span>
                    );
                  })}
                </div>
              )} */}
            </div>

            {/* Submit Buttons */}
            <div className="d-flex gap-3 mt-3">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setActiveTab("")}
              >
                Cancel
              </button>
            </div>
          </form>
        );
      case "services":
        return (
          <form onSubmit={handleSubmit}>
            <div className="row align-items-start">
              <div className="edit-profile-field">
                <label>Add Services</label>
                <input
                  type="text"
                  value={serviceInput}
                  className="form-control"
                  onChange={(e) => setServiceInput(e.target.value)}
                  onKeyDown={handleServiceKeyDown}
                  placeholder="Type a service and press Enter"
                />

                {/* Render Services as Badges */}
                <div className="mt-3 d-flex flex-wrap">
                  {formData.services.map((srv, index) => (
                    <span key={index} className="badge bg-dark me-2 mb-2 p-2">
                      {srv}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        onClick={() => removeService(index)}
                        aria-label="Remove"
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 mt-3">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary m-0"
                onClick={() => setActiveTab("")}
              >
                Cancel
              </button>
            </div>
          </form>
        );

      case "servicearea":
        return (
          <form onSubmit={handleSubmit}>
            <div className="mb-3 position-relative">
              <label className="form-label">Services Area/Pincode <sup>*</sup></label>
              <input
                type="text"
                className="form-control"
                placeholder="Search Area or Pincode"
                value={serviceAreaInput}
                onChange={(e) => setServiceAreaInput(e.target.value)}
              />
              {serviceAreaInput && filteredAreas.length > 0 && (
                <ul className="list-group position-absolute z-3 w-100">
                  {filteredAreas.map((area) => (
                    <li
                      key={area}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleSelectArea(area)}
                      style={{ cursor: "pointer" }}
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2">
                {formData.businessArea.map((serArea) => (
                  <span key={serArea} className="badge bg-primary m-1 p-2">
                    {serArea}
                    <button
                      type="button"
                      className="btn-close ms-2 bg-danger"
                      onClick={() => removeAreaItem(serArea)}
                      aria-label="Remove"
                    />
                  </span>
                ))}
              </div>
            </div>

            <div className="d-flex gap-3 mt-3">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setActiveTab("")}
              >
                Cancel
              </button>
            </div>
          </form>
        );

      case "img":
        return (
          // <form onSubmit={handleSubmit}>
          //   <div className="row align-items-start">
          //     {/* Multiple Images */}
          //     <div className="col-md-12">
          //       <div className="edit-profile-field mb-4">
          //         <label>Upload Multiple Images</label>
          //         <div
          //           className="border p-2 rounded bg-light"
          //           style={{ minHeight: "180px" }}
          //         >
          //           <input
          //             type="file"
          //             name="images"
          //             multiple
          //             className="form-control"
          //             onChange={handleFileChange}
          //           />
          //           <div className="d-flex flex-wrap gap-3 mt-3">
          //             {formData.images?.map((img, index) => {
          //               const imgUrl =
          //                 typeof img === "string"
          //                   ? img
          //                   : img instanceof File
          //                     ? URL.createObjectURL(img)
          //                     : "";

          //               return (
          //                 <div
          //                   key={index}
          //                   className="position-relative"
          //                   style={{ width: "110px", height: "110px" }}
          //                 >
          //                   {imgUrl && (
          //                     <img
          //                       src={imgUrl}
          //                       alt={`img-${index}`}
          //                       className="img-thumbnail"
          //                       style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", }} />
          //                   )}
          //                   <button type="button" className="btn-close position-absolute top-0 end-0 bg-light text-dark p-1 rounded-circle" onClick={() => handleRemoveImage(index)} style={{ transform: "scale(0.8)" }} />
          //                 </div>
          //               );
          //             })}
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   </div>

          //   <div className="d-flex gap-3 mt-3">
          //     <button type="submit" className="btn btn-primary">Save Changes</button>
          //     <button type="button" className="btn btn-outline-secondary m-0" onClick={() => setActiveTab("")}>Cancel </button>
          //   </div>
          // </form>
          <form onSubmit={handleSubmit}>
            <div className="row align-items-start">
              <div className="col-md-12">
                <div className="edit-profile-field mb-4">
                  <label className="form-label">Upload Multiple Images</label>

                  <div className="border p-3 rounded bg-light" style={{ minHeight: "180px" }}>
                    <input
                      type="file"
                      name="images"
                      multiple
                      accept="image/*"
                      className="form-control"
                      onChange={handleFileChange}
                    />

                    {/* Preview */}
                    <div className="d-flex flex-wrap gap-3 mt-3">
                      {(formData.images || []).map((img, index) => {
                        const imageUrl =
                          typeof img === "string"
                            ? img
                            : img instanceof File
                              ? URL.createObjectURL(img)
                              : "";

                        return (
                          <div
                            key={index}
                            className="position-relative"
                            style={{ width: "110px", height: "110px" }}
                          >
                            {imageUrl && (
                              <img
                                src={imageUrl}
                                alt={`uploaded-${index}`}
                                className="img-thumbnail"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            )}
                            <button
                              type="button"
                              className="btn-close position-absolute top-0 end-0 bg-light text-dark p-1 rounded-circle"
                              onClick={() => handleRemoveImage(index)}
                              style={{ transform: "scale(0.8)" }}
                              aria-label="Remove image"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="d-flex gap-3 mt-3">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setActiveTab("")}
              >
                Cancel
              </button>
            </div>
          </form>
        );

      case "faq":
        return (
          <form onSubmit={handleSubmit}>
            {formData?.faq?.map((faq, index) => (
              <div className="row align-items-center mb-3" key={index}>
                <div className="col-md-4">
                  <div className="edit-profile-field">
                    <label>Question</label>
                    <input type="text" name="question" value={faq.question} onChange={(e) => handleFAQChange(e, index, "question")} className="form-control" required />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="edit-profile-field">
                    <label>Answer</label>
                    <input type="text" name="answer" value={faq.answer} onChange={(e) => handleFAQChange(e, index, "answer")} className="form-control" required />
                  </div>
                </div>
                {index !== 0 && (
                  <div className="col-md-3 mt-4">
                    <button type="button" className="btn btn-danger" onClick={() => handleRemoveFAQ(index)}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className="mb-3">
              <button type="button" className="btn btn-secondary" onClick={handleAddFAQ}>
                Add More
              </button>
            </div>

            <div className="mt-4">
              <button type="submit" className="btn btn-primary me-2">
                Save Changes
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setActiveTab("")}>
                Cancel
              </button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h2 className="edit-profile-title">Edit Business Profile</h2>
      <hr />
      <div className="row text-center">
        {categories.map((cat) => (
          <div key={cat.id} className="col-md-2 col-sm-3 col-6 mb-2" onClick={() => setActiveTab(cat.id)}          >
            <div className={`edit-icon-card ${activeTab === cat.id ? "active" : ""}`}  >
              <i className={`bi ${cat.icon} fs-4`}></i>
            </div>
            <p className="mt-2">{cat.label}</p>
          </div>
        ))}
      </div>
      <div className="card p-4">{renderTabContent()}</div>
    </div>
  );
}
