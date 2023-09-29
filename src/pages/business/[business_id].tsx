import React from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import JobPosting from "~/components/JobPosting";
import JobDetails from "~/components/jobs/JobDetails";
import { BusinessInfo, Jobs } from "@prisma/client";

// TEMP CATEGORIES
const categories = ["Plumbing", "Roofing", "Lawn Care", "Tree Trimming", "Painting", "Electrical", "Carpentry", "Cleaning", "Moving", "Handyman", "Other"];


const Logo = ({ business }: { business: BusinessInfo & { Jobs: Jobs[] } }) => {
  return (
    <div className=" flex-coll -center max-h-[20vh] max-w-[80vw] rounded-lg bg-accent p-4 text-white">
      <span className="text-4xl font-bold text-center">{business.business_name}</span>
      <span className="font-strong text-xl">{business.phone_number}</span>
      <span className="font-strong text-xl">{business.website}</span>
    </div>
  );
};

const Business = () => {
  const router = useRouter();
  const { business_id } = router.query;
  const { data: business } = api.business.getBusinessWithJobs.useQuery({
    business_id: business_id as string,
  });
  if (!business) return null;
  const { Jobs: jobs } = business;
  if (!jobs) return null;
  return (
    <div className="flex-coll -center gap-8 space-y-2 py-2">
      <Logo business={business} />

      <div className="flex-row -center gap-2 flex-wrap">
        {categories.map((category) => (
          <div
            key={category}
            className="bg-accent rounded-lg p-2 text-white text-center"
            onClick={() =>
              console.log({ category })
            }
          >
            {category}
          </div>
        ))}
      </div>

      <div className="flex-coll -center gap-8">
        {jobs.map((job) => (
          <JobPosting
            key={job.jobid}
            zipcode={job.zip_code}
            date={new Date(job.date)}
            photos={job.media}
            star_rating={Math.trunc(Math.random() * 6)}
          /*
          location={job.location}
          star_rating={job.star_rating}
          */
          />
        ))}
      </div>
    </div>
  );
};

export default Business;
