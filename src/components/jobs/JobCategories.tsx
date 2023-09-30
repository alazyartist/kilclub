
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
  const router = useRouter();
  const { business_id } = router.query;
  const { data: business } = api.business.getMyBusiness.useQuery();
  if (!business) return null;
  const { Jobs: jobs } = business;
  if (!jobs) return null;
  return (
    <div className="flex-row -center gap-2 flex-wrap bg-zinc-200 py-6 px-2 shadow-inner-top-bottom">
      {categories.map((category) => (
        <div
          key={uuidv4()}
          className="bg-accent rounded-md px-2 py-1 text-white text-center cursor-pointer flex-grow border-b-4 border-b-accent-dark"
          onClick={() =>
            console.log({ category })
          }
        >
          {category}
        </div>
      ))}
    </div>
  );
};

export default JobCategories;
