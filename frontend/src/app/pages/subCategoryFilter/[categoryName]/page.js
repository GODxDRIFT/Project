'use client';
import React, { Suspense } from "react";
import SubCategoryComponent from "../../../Components/SubCategoryFilterComp/SubcategoryComponent";
import { useParams, useRouter } from "next/navigation";
import Loadingcomponent from "../../../Components/loadingcomponent/Loadingcomponent";

const Page = () => {
    const params = useParams();
    const router = useRouter();
    // const { categoryName } = router.query;
    const {categoryName} = params;
    // const Id = id
   
    return (
        <Suspense fallback={<div><Loadingcomponent /></div>}>
            <SubCategoryComponent Id={categoryName} />
        </Suspense>
    );
};

export default Page;
