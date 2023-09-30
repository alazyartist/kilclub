import React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import ManageCategories from "../account/ManageCategories";

// TEMP CATEGORIES
type BusinessType = {
  business: BusinessInfo & { Jobs: Jobs[], Categories?: Categories[] } 
};

const categories = ["Plumbing", "Roofing", "Lawn Care", "Tree Trimming", "Painting", "Electrical"]
//"Roofing", "Lawn Care", "Tree Trimming", "Painting", "Electrical", "Carpentry", "Cleaning", "Moving", "Handyman"];

const JobCategories: React.FC<BusinessType> = ({ business }) => {
  const isProfile = window.location.href.includes("/profile");
  const [openCategoryForm, setOpenCategoryForm] = useState(false);

  return (
    <div className="">
      <div className="overflow-auto min-w-[100vw] min-h-[10vh] max-h-[25vh] flex-row -center gap-2 flex-wrap bg-zinc-200 pt-6 pb-10 px-2 border-b-2 border-t-2 border-base-dark shadow-inner-top-bottom">
        {categories.map((category) => (
          <div
            key={uuidv4()}
            className="font-serif text-lg strong bg-base-light rounded-md px-2 py-1 text-black text-center cursor-pointer flex-grow border-b-4 border-b-base-dark"
            onClick={() => console.log({ category })}
          > {category}
          </div>
        ))}
      </div>

      <div className="absolute min-w-[80vw] w-full flex-row justify-end">
        {isProfile && (
          <div
            className="relative -left-8 -top-5 w-10 h-10 bg-base-light rounded-full px-2 py-1 text-black text-4xl leading-5 cursor-pointer border-b-4 border-b-base-dark"
            onClick={() => setOpenCategoryForm(!openCategoryForm)}
          > +
          </div>
        )}
      </div>
      {openCategoryForm && (
        <ManageCategories />
      )}
    </div>
  );
};

export default JobCategories;
