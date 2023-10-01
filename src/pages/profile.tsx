import React from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import JobPosting from "~/components/JobPosting";
import JobDetails from "~/components/jobs/JobDetails";
import { BusinessInfo, Jobs } from "@prisma/client";
import JobCategories from "~/components/jobs/JobCategories";

const Logo = ({ business }: { business: BusinessInfo & { Jobs: Jobs[] } }) => {
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

const Profile = () => {
  const router = useRouter();
  const { business_id } = router.query;
  const { data: business } = api.business.getMyBusiness.useQuery();
  if (!business) return null;
  const { Jobs: jobs } = business;
  if (!jobs) return null;
  return (
    <div className="flex-coll -center gap-8 space-y-2 py-2">
      <Logo business={business} />

      <JobCategories business={business} />

      <div className="flex-coll -center gap-8">
        {jobs.map((job) => (
          <JobPosting
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

export default Profile;
