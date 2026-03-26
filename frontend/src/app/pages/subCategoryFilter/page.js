import React, { Suspense } from "react";
import SubCategoryComponent from "../../Components/SubCategoryFilterComp/SubcategoryComponent";
import Loadingcomponent from "../../Components/loadingcomponent/Loadingcomponent";

const Page = () => {
  return (
    <Suspense fallback={<div><Loadingcomponent /></div>}>
      <SubCategoryComponent />
    </Suspense>
  );
};

export default Page;
