"use client";

import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./BussinessCategory.css";
import Heading from "../Heading/SecHeading";
import Link from "next/link";
import Image from "next/image";
import { getData } from "../../services/FetchNodeServices";

const BussinessCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let slugify = (text) => text.toLowerCase().trim().replace(/,/g, "--").replace(/&/g, "and").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  useEffect(() => {
    // const cached = localStorage.getItem("biziffyCategories");
    // if (cached) {
    //   setCategories(JSON.parse(cached)?.filter((item) => item?.statusHome));
    //   console.log("HHHHHHH:==>", JSON.parse(cached));
    //   setLoading(false);
    // }

    const fetchCategories = async () => {
      try {
        const res = await getData("categories");
        // console.log("HHHHHHH:==>", res?.filter((item) => item?.statusHome));
        setCategories(res?.filter((item) => item?.statusHome) || []);
        // localStorage.setItem("biziffyCategories", JSON.stringify(res));
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch categories");
        setLoading(false);
      }
    };

    // Fetch only if not cached
    // if (!cached)
    fetchCategories();
  }, []);

  if (error) return <div className="text-danger text-center py-4">{error}</div>;

  return (
    <>
      <Heading title="Top Business Categories" subtitle="Explore by Category" />
      <div className="container">
        <div className="row justify-content-center">
          {loading
            ? Array(4)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="col-lg-2 col-md-3 col-sm-4 col-4 mb-2">
                  <div className="bussiness-category-card text-center">
                    <Skeleton circle={true} height={60} width={60} />
                    <Skeleton height={20} width={`80%`} className="mt-2" />
                  </div>
                </div>
              ))
            : categories?.map((category) => (
              <div key={category?._id} className="col-lg-2 col-md-3 col-sm-4 col-4 mb-3">
                <Link
                  className="text-decoration-none"
                  href={`/pages/subCategoryFilter/${slugify(category?.name)}`}
                  passHref
                >
                  <div className="bussiness-category-card text-center">
                    {category?.icon ? (
                      <Image
                        src={category?.icon}
                        alt={category?.name}
                        width={60}
                        height={60}
                        className="rounded"
                        loading="lazy"
                      />
                    ) : (
                      <div className="default-icon">{category?.name.charAt(0).toUpperCase()}</div>
                    )}
                    <h6 className="category-title mt-2">{category?.name}</h6>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default BussinessCategory;
