// "use client";
// import React, { useState, useRef } from "react";
// import "../../pages/freelistingform/freelistingform.css";

// const ContactPerson = ({ setKey, formData, setFormData }) => {
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const formRef = useRef(null);

//   /* ---------- helpers ---------- */

//   // Generic change handler (non‑phone fields)
//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       contactPerson: {
//         ...prev.contactPerson,
//         [e.target.name]: e.target.value,
//       },
//     }));
//   };

//   // Phone / WhatsApp – allow digits only, max 10
//   const handlePhoneChange = (e) => {
//     const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
//     setFormData((prev) => ({
//       ...prev,
//       contactPerson: {
//         ...prev.contactPerson,
//         [e.target.name]: e.target.value,
//       },
//     }));
//   };

//   // Validation rules
//   const validate = () => {
//     const newErrors = {};
//     const nameReg = /^[A-Za-z\s'-]{1,30}$/;
//     const phoneReg = /^\d{10}$/;
//     const emailReg =
//       /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i; // simple email check

//     if (!formData.title) newErrors.title = "Select a title.";
//     if (!nameReg.test(formData.firstName || ""))
//       newErrors.firstName = "Enter a valid first name.";
//     if (!nameReg.test(formData.lastName || ""))
//       newErrors.lastName = "Enter a valid last name.";
//     if (!phoneReg.test(formData.contactNumber || ""))
//       newErrors.contactNumber = "Enter a 10‑digit contact number.";
//     if (!phoneReg.test(formData.whatsappNumber || ""))
//       newErrors.whatsappNumber = "Enter a 10‑digit WhatsApp number.";
//     if (!emailReg.test(formData.email || ""))
//       newErrors.email = "Enter a valid e‑mail address.";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /* ---------- submit ---------- */

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) {
//       // focus first invalid field
//       const firstErrorField = Object.keys(errors)[0];
//       formRef.current[firstErrorField]?.focus();
//       return;
//     }

//     setLoading(true);
//     // fake async delay, replace with real call
//     setTimeout(() => {
//       setLoading(false);
//       setKey("business");
//     }, 400);
//   };

//   /* ---------- render ---------- */

//   return (
//     <form onSubmit={handleSubmit} ref={formRef} noValidate>
//       <div className="text-center mb-4">
//         <h5 className="section-title">
//           Fill Your Contact Details<sup>*</sup>
//         </h5>
//       </div>

//       {/* ---- Title ---- */}
//       <div className="mb-3">
//         <label className="form-label">
//           Title<sup>*</sup>
//         </label>
//         <select
//           className={`form-control ${errors.title ? "is-invalid" : ""}`}
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//         >
//           <option value="">Select Title</option>
//           <option value="Mr">Mr</option>
//           <option value="Ms">Ms</option>
//         </select>
//         {errors.title && <div className="invalid-feedback">{errors.title}</div>}
//       </div>

//       {/* ---- First Name ---- */}
//       <div className="mb-3">
//         <label className="form-label">
//           First Name<sup>*</sup>
//         </label>
//         <input
//           type="text"
//           className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
//           name="firstName"
//           value={formData.firstName}
//           onChange={handleChange}
//           required
//         />
//         {errors.firstName && (
//           <div className="invalid-feedback">{errors.firstName}</div>
//         )}
//       </div>

//       {/* ---- Last Name ---- */}
//       <div className="mb-3">
//         <label className="form-label">
//           Last Name<sup>*</sup>
//         </label>
//         <input
//           type="text"
//           className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
//           name="lastName"
//           value={formData.lastName}
//           onChange={handleChange}
//           required
//         />
//         {errors.lastName && (
//           <div className="invalid-feedback">{errors.lastName}</div>
//         )}
//       </div>

//       {/* ---- Contact Number ---- */}
//       <div className="mb-3">
//         <label className="form-label">
//           Contact Number<sup>*</sup>
//         </label>
//         <input
//           type="text"
//           inputMode="numeric"
//           className={`form-control ${errors.contactNumber ? "is-invalid" : ""}`}
//           name="contactNumber"
//           value={formData?.contactPerson?.contactNumber}
//           onChange={handlePhoneChange}
//           maxLength={10}
//           required
//         />
//         {errors.contactNumber && (
//           <div className="invalid-feedback">{errors.contactNumber}</div>
//         )}
//       </div>

//       {/* ---- WhatsApp Number ---- */}
//       <div className="mb-3">
//         <label className="form-label">
//           WhatsApp Number<sup>*</sup>
//         </label>
//         <input
//           type="text"
//           inputMode="numeric"
//           className={`form-control ${errors.whatsappNumber ? "is-invalid" : ""}`}
//           name="whatsappNumber"
//           value={formData.contactPerson.whatsappNumber}
//           onChange={handlePhoneChange}
//           maxLength={10}
//           required
//         />
//         {errors.whatsappNumber && (
//           <div className="invalid-feedback">{errors.whatsappNumber}</div>
//         )}
//       </div>

//       {/* ---- Email ---- */}
//       <div className="mb-3">
//         <label className="form-label">
//           Email<sup>*</sup>
//         </label>
//         <input
//           type="email"
//           className={`form-control ${errors.email ? "is-invalid" : ""}`}
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         {errors.email && (
//           <div className="invalid-feedback">{errors.email}</div>
//         )}
//       </div>

//       {/* ---- Submit ---- */}
//       <button
//         type="submit"
//         className="btn btn-primary w-100 py-3"
//         disabled={loading}
//       >
//         {loading ? "Submitting…" : "Next"}
//       </button>
//     </form>
//   );
// };

// export default ContactPerson;


"use client";
import React, { useState, useRef } from "react";
import "../../pages/freelistingform/freelistingform.css";

const ContactPerson = ({ setKey, formData, setFormData }) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  /* ---------- helpers ---------- */

  // Generic change handler (non‑phone fields)
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        [e.target.name]: e.target.value,
      },
    }));
  };

  // Phone / WhatsApp – allow digits only, max 10
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        [e.target.name]: digits, // Ensure only digits are updated
      },
    }));
  };

  // Validation rules
  const validate = () => {
    const newErrors = {};
    const nameReg = /^[A-Za-z\s'-]{1,30}$/;
    const phoneReg = /^\d{10}$/;
    const emailReg =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i; // simple email check

    if (!formData.contactPerson.title) newErrors.title = "Select a title.";
    if (!nameReg.test(formData.contactPerson.firstName || "")) newErrors.firstName = "Enter a valid first name.";
    if (!nameReg.test(formData.contactPerson.lastName || "")) newErrors.lastName = "Enter a valid last name.";
    if (!phoneReg.test(formData.contactPerson.contactNumber || "")) newErrors.contactNumber = "Enter a 10‑digit contact number.";
    if (!phoneReg.test(formData.contactPerson.whatsappNumber || "")) newErrors.whatsappNumber = "Enter a 10‑digit WhatsApp number.";
    if (!emailReg.test(formData.contactPerson.email || "")) newErrors.email = "Enter a valid e‑mail address.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------- submit ---------- */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      // focus first invalid field
      const firstErrorField = Object.keys(errors)[0];
      formRef.current[firstErrorField]?.focus();
      return;
    }

    setLoading(true);
    // fake async delay, replace with real call
    setTimeout(() => {
      setLoading(false);
      setKey("business");
    }, 400);
  };

  /* ---------- render ---------- */
  return (
    <form onSubmit={handleSubmit} ref={formRef} noValidate>
      <div className="text-center mb-4">
        <h5 className="section-title">
          Fill Your Contact Details<sup>*</sup>
        </h5>
      </div>

      {/* ---- Title ---- */}
      <div className="mb-3">
        <label className="form-label">
          Title<sup>*</sup>
        </label>
        <select
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          name="title"
          value={formData.title}
          onChange={handleChange}
        >
          <option value="">Select Title</option>
          <option value="Mr">Mr</option>
          <option value="Ms">Ms</option>
        </select>
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      {/* ---- First Name ---- */}
      <div className="mb-3">
        <label className="form-label">
          First Name<sup>*</sup>
        </label>
        <input
          type="text"
          className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
      </div>

      {/* ---- Last Name ---- */}
      <div className="mb-3">
        <label className="form-label">
          Last Name<sup>*</sup>
        </label>
        <input
          type="text"
          className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
      </div>

      {/* ---- Contact Number ---- */}
      <div className="mb-3">
        <label className="form-label">
          Contact Number<sup>*</sup>
        </label>
        <input
          type="text"
          inputMode="numeric"
          className={`form-control ${errors.contactNumber ? "is-invalid" : ""}`}
          name="contactNumber"
          value={formData.contactPerson.contactNumber}
          onChange={handlePhoneChange}
          maxLength={10}
          required
        />
        {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber}</div>}
      </div>

      {/* ---- WhatsApp Number ---- */}
      <div className="mb-3">
        <label className="form-label">
          WhatsApp Number<sup>*</sup>
        </label>
        <input
          type="text"
          inputMode="numeric"
          className={`form-control ${errors.whatsappNumber ? "is-invalid" : ""}`}
          name="whatsappNumber"
          value={formData.contactPerson.whatsappNumber}
          onChange={handlePhoneChange}
          maxLength={10}
          required
        />
        {errors.whatsappNumber && <div className="invalid-feedback">{errors.whatsappNumber}</div>}
      </div>

      {/* ---- Email ---- */}
      <div className="mb-3">
        <label className="form-label">
          Email<sup>*</sup>
        </label>
        <input
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      {/* ---- Submit ---- */}
      <button
        type="submit"
        className="btn btn-primary w-100 py-2"
        disabled={loading}
      >
        {loading ? (
          <span>Submitting…</span>
        ) : (
          "Next"
        )}
      </button>
    </form>
  );
};

export default ContactPerson;
