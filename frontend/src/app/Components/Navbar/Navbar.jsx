"use client";
import React, { useRef, useEffect, useState } from "react";
import "./navbar.css";
import Link from "next/link";
import Image from "next/image";
import "../../pages/login/page";
import { useRouter } from "next/navigation";
import BottomNavbar from "../NavbarBottom/Navbarbottom";
const Header = () => {
  const navbarCollapseRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [userProfile, setUserprofile] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("biziffyToken");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ NEW: Logout handler
  const handleLogout = () => {
    localStorage.removeItem("biziffyToken");
    localStorage.removeItem("biziffyUser");
    setIsLoggedIn(false);
    router.push("/pages/login");
    window.location.href = "/pages/login"; // redirect to login after logout
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navbarCollapseRef.current &&
        !navbarCollapseRef.current.contains(event.target)
      ) {
        const bsCollapse = new window.bootstrap.Collapse(
          navbarCollapseRef.current,
          {
            toggle: false,
          }
        );
        bsCollapse.hide();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("biziffyUser"));
    setUserprofile(storedUser?.profileImage);
    if (storedUser?.image) {
      setAvatarUrl(storedUser?.profileImage);
    }
  }, []);
  const showFallback = !avatarUrl || imgError;
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" href="/">
            <p className="logo-text">
              Bizi<span>ff</span>y{" "}
            </p>
            {/* <Image src={logo} alt="logo" /> */}
          </Link>
          {/* <button className="navbar-toggler">
            <span>
              {!isLoggedIn ? (
                <>
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
                </>
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
                  <ul
                    className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-2"
                    aria-labelledby="profileDropdown"
                    style={{ minWidth: "150px" }}
                  >
                    <li className="py-2">
                      <Link
                        href="/pages/Profile"
                        className="dropdown-item d-flex align-items-center gap-2"
                      >
                        <i className="bi bi-person"></i> Dashboard
                      </Link>
                    </li>
                    <li className="py-2">
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 text-danger"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </span>
          </button> */}
          <div className="navbar-toggler-wrapper d-flex d-lg-none d-flex align-items-center gap-2">
            {!isLoggedIn ? (
              <>
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
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn border-0 d-flex d-lg-none align-items-center m-0"
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
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-2"
                  aria-labelledby="profileDropdown"
                  style={{ minWidth: "150px" }}
                >
                  <li className="pb-2">
                    <Link
                      href="/pages/Profile"
                      className="dropdown-item d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-person"></i> Dashboard
                    </Link>
                  </li>
                  <li className=" ">
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
            ref={navbarCollapseRef}
          >
            <ul className="navbar-nav mb-2 mb-lg-0 w-100">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/pages/earn-with-us"
                  onClick={() => {
                    new window.bootstrap.Collapse(navbarCollapseRef.current, {
                      toggle: false,
                    }).hide();
                  }}
                >
                  Earn With Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/pages/corporate-advertise"
                  onClick={() => {
                    new window.bootstrap.Collapse(navbarCollapseRef.current, {
                      toggle: false,
                    }).hide();
                  }}
                >
                  Corporate Advertise
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/pages/free-listing"
                  onClick={() => {
                    new window.bootstrap.Collapse(navbarCollapseRef.current, {
                      toggle: false,
                    }).hide();
                  }}
                >
                  Free Listing
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href={isLoggedIn?"/pages/Profile":"/pages/mybusiness"}
                  onClick={() => {
                    new window.bootstrap.Collapse(navbarCollapseRef.current, {
                      toggle: false,
                    }).hide();
                  }}
                >
                  My Business
                </Link>
              </li>

              {/* Show Logout in collapsed mobile menu */}
              {/* {isLoggedIn && (
                <li className="nav-item d-lg-none">
                  <button className="nav-link text-danger" onClick={handleLogout}>
                    <b>Log Out</b>
                  </button>
                </li>
              )} */}

              {/* Right-aligned items */}
            </ul>
            <div>
              <li className="nav-item d-flex align-items-center">
                {!isLoggedIn ? (
                  <>
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
                  </>
                ) : (
                  <div className="dropdown">
                    <button
                      className="btn border-0 d-flex align-items-center m-0"
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
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-2"
                      aria-labelledby="profileDropdown"
                      style={{ minWidth: "150px" }}
                    >
                      <li>
                        <Link
                          href="/pages/Profile"
                          className="dropdown-item d-flex align-items-center gap-2"
                        >
                          <i className="bi bi-person"></i> Dashboard
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center gap-2 text-danger"
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-right"></i> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </div>
          </div>
        </div>
      </nav>
      <BottomNavbar isLoggedIn={isLoggedIn} />
    </>
  );
};

export default Header;
