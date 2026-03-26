"use client";
import Link from "next/link";
import Image from "next/image";
import "./footer.css";
import logo from "../../Images/logo.jpg";
import { useEffect, useState } from "react";
import { getData } from "../../services/FetchNodeServices";
import DealOffers from "../../Components/Businesslistingdetails/DealOffers"; // ✅ NEW: Import DealOffers component
// import DealOffers from ".'";

const Footer = (url) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ NEW: state for login check
  useEffect(() => {
    // ✅ NEW: Check localStorage for token on page load
    const token = localStorage.getItem("biziffyToken");
    setIsLoggedIn(!!token);
  }, []);

  const [categories, setCategories] = useState([]); // array of results
  const [loading, setLoading] = useState(true); // UI spinner flag
  const [error, setError] = useState(null); // error message

  useEffect(() => {
    let isMounted = true; // ↩︎ guards against setting state on unmounted component

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getData("categories");
        if (isMounted) {
          setCategories(data); // ✅ store the results
          setError(null); // clear any previous error
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        if (isMounted) setError("Failed to fetch categories");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();

    // cleanup to avoid memory leaks if the component unmounts during the request
    return () => {
      isMounted = false;
    };
  }, [url]); // ↩︎ refetch if the endpoint changes

  const limitedCategories =
    categories?.length >= 3 ? categories?.slice(0, 5) : [];

  const slugify = (text = "") => text.toLowerCase().trim().replace(/,/g, "--").replace(/&/g, "and").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");


  return (
    <>
      <footer className="footer">
        <DealOffers />
        <div className="container">
          <div className="row">
            {/* Logo & Social Media */}
            <div className="col-lg-3 col-md-6 col-6 footer-section">
              <Link className="navbar-brand" href="/">
                <p className="logo-text">
                  Bizi<span>ff</span>y{" "}
                </p>
              </Link>
              <p className="footer-description">
                Your trusted partner in digital solutions.
              </p>
              <div className="social-icons">
                <Link target="_blank" href="https://x.com/biziffy_india">
                  <i className="bi bi-twitter"></i>
                </Link>
                <Link
                  target="_blank"
                  href="https://www.facebook.com/people/Biziffy-India/pfbid05EeMQK7qXrw5nuEe2B6cKNhBwYTskFwsMrijTM1WdgijuLjvuXUa7GQ94WJM9AEvl/"
                >
                  <i className="bi bi-facebook"></i>
                </Link>
                <Link target="_blank" href="#">
                  <i className="bi bi-linkedin"></i>
                </Link>
                <Link
                  target="_blank"
                  href="https://www.instagram.com/biziffyindia/"
                >
                  <i className="bi bi-instagram"></i>
                </Link>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="col-lg-2 col-md-6 col-6 footer-section">
              <h5>Company</h5>
              <ul>
                <li>
                  <Link href="/pages/aboutus">About Us</Link>
                </li>

                <li>
                  <Link href="/pages/contact-us">Contact Us</Link>
                </li>
                <li>
                  <Link href="/pages/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/pages/term-and-conditions">
                    Term & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/pages/shippingPolicy">Shipping Policy</Link>
                </li>
                <li>
                  <Link href="/pages/refundPolicy">Refund Policy</Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 col-6 footer-section">
              <h5>Services</h5>
              <ul>
                {limitedCategories?.slice(0, 5)?.map((c, index) => (
                  <Link
                    key={index}
                    className="text-decoration-none"
                    href={`/pages/subCategoryFilter/${slugify(c?.name)}`}
                    passHref
                  >
                    <li className="footer-cat-li" key={c?._id}>
                      {c?.name}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 col-6 footer-section">
              <h5>How It Works</h5>
              <ol className="p-0">
                <li>Submit Your Business Details.</li>
                <li>We Process the Listings.</li>
                <li>Review & Optimization.</li>
                <li>Track Your Performance.</li>
              </ol>
            </div>

            {/* Member Section */}
            <div className="col-lg-3 col-md-6 footer-section">
              <h5>Biziffy Members</h5>
              <div className="d-flex  login-function align-items-center flex-wrap">
                {!isLoggedIn ? (
                  <div className="d-flex align-items-center ">
                    <Link
                      href="/pages/login"
                      className="btn btn bg-primary text-white me-2"
                    >
                      SignIn
                    </Link>
                    <Link
                      href="/pages/signup"
                      className="btn btn bg-dark text-white me-2"
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  ""
                  // <div className="hero-buttons">
                  //   <Link href="/pages/list-your-webiste" className="herobutton1">
                  //     List Your Website
                  //   </Link>
                  //   <Link href="/pages/freelistingform" className="herobutton2">
                  //     List Your Business
                  //   </Link>
                  // </div>
                )}
              </div>
              <p className="m-0">Find and connect with businesses near you.</p>
            </div>
          </div>
          <hr />
          <div className="footer-bottom text-center">
            <p>
              © {new Date().getFullYear()} Biziffy Media Inc. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
