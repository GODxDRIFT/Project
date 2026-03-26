// "use client";

// import React, { useState, useEffect } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "react-loading-skeleton/dist/skeleton.css";
// import defaultImage from "../../Images/Favicon.jpg"

// import "./HomeCategoryslider.css";
// import { getData } from "../../services/FetchNodeServices";
// import Heading from "../Heading/SecHeading";
// import Loadingcomponent from "../loadingcomponent/Loadingcomponent";

// const CARD_PX = 160;

// export default function HomeCategorySlider() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [categories, setCategories] = useState([]);
//   const [location, setLocation] = useState({});
//   const [error, setError] = useState(null);
//   const [localLocation, setLocalLocation] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await getData("admin/subcategories");
//         setCategories(res?.filter((item) => item?.statusHome) || []);
//       } catch (e) {
//         setError("Failed to fetch categories");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     const LDATA = localStorage.getItem("biziffyLocation");
//     const Local = JSON.parse(LDATA);
//     setLocalLocation(Local);
//     if (!Local) {
//       handleDetectLocation()
//     }

//   }, []);

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
//     text?.toLowerCase().trim().replace(/,/g, "--").replace(/&/g, "and").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

//   const handleClick = (card) => {
//     // const { pincode = "", state = "" } = localLocation ?? location;
//     console.log("XXXXXXX:=>", localLocation, location)
//     const state = localLocation.length > 0 ? localLocation.stateName || localLocation.state : location?.state || location?.stateName;
//     const pinCode = localLocation.length > 0 ? localLocation.pincode || localLocation.pinCode : location?.pinCode || location?.pincode;

//     if (!pinCode || !state) return alert("Please wait for location.");

//     router.push(`/pages/bussiness-listing/${pinCode}/${slugify(state)}/${slugify(card?.name)}`);
//   };


//   return (
//     <section className="home-category-section">
//       <div className="container">
//         <Heading className="m-0" title="Top Business Solutions" />
//         {error && <p className="text-danger">{error}</p>}

//         {loading ? (
//           <Loadingcomponent />
//         ) : (
//           <Swiper
//             modules={[Navigation, Pagination, Autoplay]}
//             spaceBetween={10}
//             slidesPerView={5}
//             navigation
//             pagination={{ clickable: true }}
//             autoplay={{ delay: 3000 }}
//             breakpoints={{
//               320: { slidesPerView: 2 },
//               768: { slidesPerView: 3 },
//               1024: { slidesPerView: 5 },
//             }}
//             className="home-category-swiper"
//           >
//             {categories?.map((card, index) => (
//               <SwiperSlide key={card?._id}>
//                 <div
//                   className="home-category-card"
//                   onClick={() => handleClick(card)}
//                   role="button"
//                   tabIndex={0}
//                   onKeyDown={(e) => e.key === "Enter" && handleClick(card)}
//                 >
//                   <Image
//                     src={card?.image || defaultImage}
//                     alt={card?.name || "Category"}
//                     width={CARD_PX}
//                     height={CARD_PX}
//                     quality={75}
//                     loading={index === 0 ? "eager" : "lazy"} // only first image loads eagerly
//                     className="home-category-card-image"
//                   />
//                   <div className="card-body pt-2">
//                     <h5 className="home-category-card-title">{card?.name}</h5>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         )}
//       </div>
//     </section>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import defaultImage from "../../Images/Favicon.jpg";
import "./HomeCategoryslider.css";
import { getData } from "../../services/FetchNodeServices";
import Heading from "../Heading/SecHeading";
import Loadingcomponent from "../loadingcomponent/Loadingcomponent";

const CARD_PX = 150;

export default function HomeCategorySlider() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState({
    area: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getData("admin/subcategories");
        setCategories(res?.filter((item) => item?.statusHome === true) || []);
      } catch (e) {
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    })();

    const saved = localStorage.getItem("biziffyLocation");
    const locationData = JSON.parse(saved)
    console.log("locationData:==>", locationData)
    if (locationData) {
      setLocation(JSON.parse(saved));
    } else {
      requestGeolocation();
    }
  }, []);

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      handlePositionSuccess,
      (error) => {
        console.error("Geolocation error:", error);
        alert("Please enable location access.");
      }
    );
  };

  const handlePositionSuccess = async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      const response = await getData(`googleApi/reverse-geocode?lat=${latitude}&lon=${longitude}`);
      console.log("Location response:", response);

      if (response?.status === true) {
        const loc = {
          area: response.area || "",
          city: response.city || "",
          state: response.state || "",
          pinCode: response.pincode || "",
        };
        setLocation(loc);
        localStorage.setItem("biziffyLocation", JSON.stringify(loc));
      } else {
        alert("Failed to fetch location.");
      }
    } catch (err) {
      console.error("Error detecting location:", err);
      alert("Something went wrong while detecting your location.");
    }
  };

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/,/g, "--")
      .replace(/&/g, "and")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleClick = (card) => {
    console.log("hh==>>>", location)
    // if (!location.pinCode || !location.state || !location.city || !location.area || !location.stateName) {
    //   return alert("Please wait, detecting your location...");
    // }

    const path = `/pages/bussiness-listing/${location?.pinCode || location?.pincode}/${slugify(location?.state || location?.stateName)}/${slugify(card?.name)}`;
    router.push(path);
  };

  return (
    <>
    <section className="home-category-section">
      <div className="container">
        <Heading className="m-0" title="Top Business Solutions" />
        {error && <p className="text-danger">{error}</p>}

        {loading ? (
          <Loadingcomponent />
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={5}
            navigation
            pagination={{ clickable: true }}
            autoplay={false}
            // autoplay={{ delay: 3000 }}
            breakpoints={{ 320: { slidesPerView: 4 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 6 } }}
            className="home-category-swiper"
          >
            {categories.map((card) => (
              <SwiperSlide key={card._id}>
                <div
                  className="home-category-card"
                  onClick={() => handleClick(card)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleClick(card)}
                >
                  <Image
                    src={card.image || defaultImage}
                    alt={card.name || "Category"}
                    width={CARD_PX}
                    height={CARD_PX}
                    quality={100}
                    loading="lazy"
                    className="home-category-card-image"
                  />
                  {/* <div className="card-body pt-2">
                    <h5 className="home-category-card-title">{card.name}</h5>
                  </div> */}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
    </>
  );
}
