"use client";

import React, { useEffect, useState } from "react";
import "../citytourismGuide.css";
import Link from "next/link";
import Head from "next/head";
import { useParams } from "next/navigation";
import Image from "next/image";
import LoadingComponent from "../../../Components/loadingcomponent/Loadingcomponent"
import { getData } from "../../../services/FetchNodeServices";
const Page = () => {
    //   const { id } = useParams();
    const params = useParams();
    const { cityName } = params;
    // alert(JSON.stringify(cityName))
    const [data, setData] = useState(null);
    let slugify = (text) => text.toLowerCase().trim().replace(/,/g, "--").replace(/&/g, "and").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    const formatSlugs = (slug) => {
        if (!slug) return "";
        return slug.replace(/-and-/g, " & ").replace(/--/g, ",").replace(/-/g, " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };

    useEffect(() => {
        if (!cityName) return;
        const fetchTopCity = async () => {
            try {
                const res = await getData(`populerCity/get-all-popular-cities`);

                const result = res?.data;
                if (res?.status) {
                    // console.log("XXXXX=>", result.filter((item) => formatSlugs(item?.city.name) === formatSlugs(cityName)));
                    setData(result.filter((item) => formatSlugs(item?.city.name) === formatSlugs(cityName))[0]);
                }
            } catch (error) {
                console.error("Error fetching city details:", error);
            }
        };

        fetchTopCity();
    }, [cityName]);


    if (!data) return <LoadingComponent />;

    return (
        <>
            <Head>
                <title>{data?.cityName} - Top Businesses | Biziffy</title>
                <meta
                    name="description"
                    content={`Discover top businesses in ${data?.cityName} on Biziffy.`}
                />
            </Head>

            <section>
                <div className="all-breadcrumb">
                    <Image
                        src={data?.banner}
                        alt="Breadcrumb Background"
                        className="w-100"
                        layout="fill"

                        priority
                        objectFit="cover"
                    />
                    <div className="city-bread-overlay"></div>
                    <div className="container">
                        <div className="bread-content">
                            <h1>Discover the Best of {data?.cityName}</h1>
                            <h6>Welcome to the City of Dreams</h6>
                        </div>
                    </div>
                </div>
            </section>

            <section className="citys-section">
                <div className="container">
                    <div className="row justify-content-start">
                        <div className="col-md-12">
                            <div className="citys-section-head">
                                <h1 className="citys-section-heading">
                                    What are you looking for?
                                </h1>
                            </div>
                        </div>
                        {data?.category?.map((category, index) => (
                            <div key={index} className="col-md-2 col-sm-3 col-4">
                                <div className="city-category-select-data">
                                    <Link
                                        href={`/pages/bussiness-listing/${data?.city?.pinCode || '12121'}/${slugify(data?.city?.state || 'state')}/${slugify(category?.name || 'business-name')}`}
                                    // href={`/pages/bussiness-listing?query=${category?.name}&pincode=${data?.city?.pinCode}&title=${"CityPage"}`}
                                    >
                                        <div className="city-category-img">
                                            <Image
                                                src={category?.icon}
                                                alt={category?.name}
                                                className="city-category-round-img"
                                                height={100}
                                                width={100}
                                                quality={100}
                                                priority
                                            />
                                        </div>
                                    </Link>
                                    <h4 className="city-category-title">{category?.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            <section className="city-about-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-5">
                            <div className="city-about-div">
                                <Image
                                    src={data?.city?.cityImage}
                                    alt="About Mumbai"
                                    className="city-about-image"
                                    height={100}
                                    width={100}
                                    quality={100}
                                    priority
                                />
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="city-about-content">
                                <h1 className="city-about-title">About {data?.cityName}</h1>
                                <p className="city-about-text">
                                    {data?.abouteCity ||
                                        `Explore the best businesses and attractions in ${data?.cityName}.`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Page;
