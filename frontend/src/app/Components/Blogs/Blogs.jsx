"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Heading from "../../Components/Heading/SecHeading";
import Image from "next/image";
import "./blog.css";
import Link from "next/link";
import { getData } from "../../services/FetchNodeServices";

export default function Blogs() {
  const [blogList, setBlogList] = useState([]);

  let slugify = (text) => text.toLowerCase().trim().replace(/,/g, "--").replace(/&/g, "and").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  useEffect(() => {
    (async () => {
      const res = await getData("blog/get-all-blogs");
      if (res?.status) setBlogList(res.data.filter((b) => b?.status));
    })();
  }, []);

  return (
    <section className="blog-main">
      <div className="container">
        <Heading title="Blogs" subtitle="Here are our latest posts" />

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {blogList.map((blog) => (
            <SwiperSlide key={blog?._id} className="py-3">
              <article className="blog-card">
                <div className="blog-card-imgwrap">
                  <Image
                    priority
                    src={blog?.image}
                    alt={blog?.heading}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="blog-card-img"
                  />
                </div>

                <div className="blog-card-body">
                  <h5 className="blog-card-title">{blog?.heading}</h5>
                  <p className="blog-card-text">{blog?.shortDisc}</p>

                  {/* <Link href={`/pages/blog/${blog?._id}`} className="blog-btn">
                    Read&nbsp;More <i className="bi bi-arrow-right-circle"></i>
                  </Link> */}
                  <Link href={`/pages/blog/${slugify(blog?.heading)}`} onClick={() => { localStorage?.setItem("blogId", blog?._id) }}
                    className="blog-btn">
                    Read&nbsp;More <i className="bi bi-arrow-right-circle"></i>
                  </Link>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center mt-4">
          <Link href="/pages/blog">
            <button className="blog-btn">
              View&nbsp;All&nbsp;Posts <i className="bi bi-eye"></i>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
