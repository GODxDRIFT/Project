"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { getData, postData } from "../../services/FetchNodeServices"; // adjust if needed
import "./plan.css";

// const pricingPlans = [
//     {
//         name: 'Free', price: '0',
//         values: ['Yes', 'No', 'No', '5', 'No', 'No', 'No', 'Yes', 'No', 'Yes', 'No', 'No', 'No', 'No', 'Yes', 'Yes', 'No', 'Yes'],
//         features: ['Listing By Name', 'Product Service Image Only 5', 'Customer Support', 'Business Connect Form', 'Custom Business URL', 'Customer Review and Rating', 'Multiple Free Listings',]
//     },
//     {
//         name: 'Standard', price: '1660',
//         values: ['Yes', 'Yes', '20 / Month', '15', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Listing below top 5', 'Basic FAQ+ in Similar Listing', 'Yes', 'No', 'Yes', 'Yes', 'No', 'Yes'],
//         features: ['Listing By Name', 'Listing By Category', 'Leads 20 / Month', 'Product Service Image only 15', 'Weblite URL', 'Location URL', 'Social Media URL', 'Customer Support', 'Dashboard Analytics', 'Business Connect Form ', 'Feature in Category List', 'SEO Optimization', 'Verified Badge', 'Custom Business URL', 'Customer Review and Rating', 'Multiple Free Listings',]
//     },
//     {
//         name: 'Premium', price: '9124',
//         values: ['Yes', 'Yes', '45 / Month', '30', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Listing in top 5', 'Basic FAQ+ in Similar Listing', 'Yes', 'No', 'Yes', 'Yes', 'No', 'Yes'],
//         features: ['Listing By Name', 'Listing By Category', 'Leads', 'Product Service Image', 'Weblite URL', 'Location URL', 'Social Media URL', 'Customer Support', 'Dashboard Analytics', 'Business Connect Form', 'Feature in Category List', 'SEO Optimization', 'Verified Badge', 'Trusted', 'Custom Business URL', 'Customer Review and Rating', 'Promotion of Blog / Newsletter', 'Multiple Free Listings',]
//     },
// ];

const featureList = [
    'Listing By Name', 'Listing By Category', 'Product Service Image', 'Weblite URL', 'Location URL', 'Social Media URL',
    'Customer Support', 'Dashboard Analytics', 'Business Connect Form', 'Feature in Category List', 'SEO Optimization',
    'Verified Badge', 'Trusted', 'Custom Business URL', 'Customer Review and Rating', 'Promotion of Blog / Newsletter', 'Multiple Free Listings',
];


const renderValue = (val) => {
    if (val === 'Yes') return <FaCheckCircle className="text-success fs-5" />;
    if (val === 'No') return <FaTimesCircle className="text-danger fs-5" />;
    return <span className="text-muted">{val}</span>;
};

const Plan = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', remember: false });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [pricingPlans, setPricingPlans] = useState([])

    const fetchPlans = async () => {
        try {
            const res = await getData(`plans/get-all-plan`);
            if (res.status === true) {
                const reversedData = res.data.reverse();
                setPricingPlans(reversedData);
            }
        } catch (error) {
            console.error("Error fetching plans", error);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("biziffyUser");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const handlePlanClick = (plan) => {
        if (!user) {
            setShowLoginModal(true);
        } else {
            localStorage.setItem("selectedPlan", JSON.stringify(plan));
            const target = plan?.name === "Free" ? "/pages/freelistingform" : `/pages/checkout`;
            router.push(target);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const validate = () => {
        const errors = {};
        if (!formData.email) errors.email = "Email is required";
        if (!formData.password) errors.password = "Password is required";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);

        try {
            const response = await postData('auth/user-login', {
                email: formData.email,
                password: formData.password,
            });

            if (response?.status) {
                localStorage.setItem("biziffyToken", response.token);
                localStorage.setItem("biziffyUser", JSON.stringify(response.user));
                setSuccessMessage("Login successful! Redirecting...");
                setLoginError("");

                setTimeout(() => {
                    setShowLoginModal(false);
                    window.location.reload();
                }, 1500);
            } else {
                setLoginError(response?.message || "Invalid login credentials.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setLoginError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="paidlisting" className="py-5 bg-light">
            <div className="container">
                <div className="text-center mb-5">
                    <h1 className="fw-bold">
                        Premium <span style={{ color: 'var(--blue)' }}>Business</span> Listing Packages
                    </h1>
                    <p className="text-muted">Choose the plan that suits your business best</p>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered text-center align-middle shadow-sm bg-white plan-table">
                        <thead className="table-primary">
                            <tr>
                                <th>Features</th>
                                {pricingPlans.map((plan, idx) => (
                                    <th key={idx} className={`plan-header ${plan.name === 'Premium' ? 'table-warning' : ''}`}>
                                        <div className="fw-bold fs-5">{plan?.name}</div>
                                        <div className="fw-light fs-6">₹{plan?.price} / Month</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {featureList.map((feature, rowIdx) => (
                                <tr key={rowIdx}>
                                    <td className="fw-semibold text-start ps-3">{feature}</td>
                                    {pricingPlans?.map((plan, colIdx) => (
                                        <td key={colIdx}>{renderValue(plan?.values[rowIdx])}</td>
                                    ))}
                                </tr>
                            ))}
                            <tr>
                                <td></td>
                                {pricingPlans?.map((plan, idx) => (
                                    <td key={idx}>
                                        <button
                                            onClick={() => handlePlanClick(plan)}
                                            className="btn btn-outline-primary btn-sm w-100"
                                        >
                                            {plan?.name === 'Free' ? 'Start Free' : 'Buy Now'}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {showLoginModal && (
                <div className="custom-modal-backdrop">
                    <div className="custom-modal-card">
                        <div className="modal-header justify-content-between border-0 px-4 pt-4">
                            <h5 className="modal-title text-primary fw-bold">Please Login First</h5>
                            <button type="button" className="btn-close" onClick={() => setShowLoginModal(false)}></button>
                        </div>

                        <div className="alert alert-warning rounded-0 m-0 px-4 py-2 fw-medium border-top border-bottom">
                            🔓 Unlock the deals — log in before you seal the package!
                        </div>

                        <div className="modal-body px-4 pb-4">
                            <h4 className="text-center fw-bold mt-3">Welcome Back 👋</h4>
                            <p className="text-center text-muted mb-4">Sign in to continue</p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="form-control rounded-pill"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
                                </div>

                                <div className="mb-3 position-relative">
                                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        className="form-control rounded-pill pe-5"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <span
                                        className="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"
                                        onClick={togglePasswordVisibility}
                                        aria-label="Toggle password visibility"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                                    </span>
                                    {errors.password && <div className="text-danger">{errors.password}</div>}
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="rememberMe"
                                            name="remember"
                                            checked={formData.remember}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                    </div>
                                    <Link href="/pages/forgot-password" className="text-decoration-none text-primary">
                                        Forgot Password?
                                    </Link>
                                </div>

                                <button type="submit" className="btn btn-primary w-100 rounded-pill py-2" disabled={isLoading}>
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </button>

                                {loginError && <p className="text-danger text-center mt-3">{loginError}</p>}
                                {successMessage && <p className="text-success text-center mt-3">{successMessage}</p>}

                                <p className="text-center mt-4 mb-0 text-muted">
                                    Don’t have an account?{" "}
                                    <Link href="/pages/signup" className="fw-bold text-primary text-decoration-none">
                                        Register here
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Plan;
