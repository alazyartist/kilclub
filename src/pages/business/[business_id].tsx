import React, { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import JobPosting from "~/components/JobPosting";
import BusinessCategories from "~/components/jobs/BusinessCategories";
import { type GetBusinessWithJobs } from "~/utils/RouterTypes";

const Logo = ({ business }: { business: GetBusinessWithJobs }) => {
  return (
    <div className=" flex-coll -center max-h-[20vh] max-w-[80vw] rounded-lg bg-accent p-4 text-white">
      <span className="text-center text-4xl font-bold">
        {business.business_name}
      </span>
      <span className="font-strong text-xl">{business.phone_number}</span>
      <span className="font-strong text-xl">{business.website}</span>
    </div>
  );
};

const Business = () => {
  const router = useRouter();
  const [filter, setFilter] = useState("");
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

      <BusinessCategories
        filter={filter}
        setFilter={setFilter}
        business={business}
      />

      <div className="flex-coll -center gap-8">
        {jobs
          .filter((job) =>
            job.Categories.some((c) => c.Category.name.includes(filter)),
          )
          .map((job) => (
            <JobPosting
              review={job.review}
              jobCategories={job.Categories.map((c) => c.Category)}
              key={job.job_id}
              zipcode={job.zip_code}
              date={new Date(job.date)}
              photos={job.media as string[]}
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
