import React from "react";
import { useState } from "react";
import CategoryPopup from "../account/CategoryPopup";
import { api } from "~/utils/api";
import type { GetBusinessWithJobs, GetMyBusiness } from "~/utils/RouterTypes";
import { Circle } from "../layout/Icons";
import Link from "next/link";

// TEMP CATEGORIES
type BusinessType = {
  business: GetMyBusiness | GetBusinessWithJobs;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
};

const BusinessCategories: React.FC<BusinessType> = ({
  business,
  setFilter,
  filter,
}) => {
  const isProfile = window.location.href.includes("/profile");
  const { data: allCategories } = api.category.getCategories.useQuery();
  const [openCategoryForm, setOpenCategoryForm] = useState(false);

  return (
    <div className="">
      <div className="-center shadow-inner-top-bottom max-h-[25vh] min-h-[10vh] min-w-[100vw] flex-row flex-wrap gap-2 overflow-auto border-b-2 border-t-2 border-zinc-300 bg-zinc-100 px-2 pb-10 pt-6">
        {Array.isArray(business?.Categories) &&
          business.Categories.map((c) => (
            <div
              key={c.Category.category_id}
              className={`${
                filter === c.Category.name
                  ? "-light ring-2 ring-accent-light "
                  : ""
              } strong flex-grow cursor-pointer rounded-md bg-base-light px-2 py-1 text-center font-sans text-lg text-black drop-shadow-md `}
              onClick={() => {
                setFilter((prev) =>
                  prev !== c.Category.name ? c.Category.name : "",
                );
                console.log({ c });
              }}
            >
              {c.Category.name}
            </div>
          ))}
        {business.Categories.length < 1 && isProfile && (
          <div>
            <p>You have no associated categories</p>
            <Link href={"/jobs"}>
              <p className="rounded-md bg-zinc-800 p-2 text-center font-bold text-zinc-100">
                Categorize Jobs
              </p>
            </Link>
          </div>
        )}
      </div>

      {isProfile && (
        <div className="absolute w-full min-w-[80vw] flex-row justify-end">
          {/* <div
            className="relative -left-8 -top-5 h-10 w-10 cursor-pointer rounded-full bg-base-light px-2 py-1 text-4xl leading-5 text-black shadow-md shadow-zinc-500"
            onClick={() => setOpenCategoryForm(!openCategoryForm)}
          >
            {" "}
            +
          </div> */}
          <div
            className="relative -left-8 -top-5 h-10 w-10 cursor-pointer rounded-full bg-base-light text-black shadow-md shadow-zinc-500"
            onClick={() => setOpenCategoryForm(!openCategoryForm)}
          >
            <Circle className={"h-full w-full"} />
          </div>
        </div>
      )}
      {openCategoryForm && (
        <CategoryPopup
          startCategories={business.Categories.map((c) => c.Category.name)}
          business_id={business.business_id}
          type="business"
          close={setOpenCategoryForm}
          categories={allCategories}
        />
      )}
    </div>
  );
};

export default BusinessCategories;
