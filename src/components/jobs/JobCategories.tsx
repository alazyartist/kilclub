
import React from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import JobPosting from "~/components/JobPosting";
import JobDetails from "~/components/jobs/JobDetails";
import { BusinessInfo, Jobs } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

// TEMP CATEGORIES
const categories = ["Plumbing", "Roofing", "Lawn Care", "Tree Trimming", "Painting", "Electrical", "Carpentry", "Cleaning", "Moving", "Handyman", "Other"];

const JobCategories = () => {
  const isProfile = window.location.href.includes("/profile");

  return (
    <div>
      <div className="flex-row -center gap-2 flex-wrap bg-zinc-200 pt-6 pb-10 px-2 shadow-inner-top-bottom">
        {categories.map((category) => (
          <div
            key={uuidv4()}
            className="bg-accent rounded-md px-2 py-1 text-white text-center cursor-pointer flex-grow border-b-4 border-b-accent-dark"
            onClick={() => console.log({ category })}
          > {category}
          </div>
        ))}
      </div>

      <div className="absolute w-full flex-row justify-end">
        {isProfile && (
          <div
            className="relative -left-5 -top-5 w-10 h-10 bg-accent rounded-full px-2 py-1 text-white text-4xl leading-5 cursor-pointer border-b-4 border-b-accent-dark"
            onClick={() => console.log("add category")}
          > +
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCategories;
