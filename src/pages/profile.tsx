import React, { useState } from "react";
import { api } from "~/utils/api";
import JobPosting from "~/components/JobPosting";
import BusinessCategories from "~/components/jobs/BusinessCategories";
import { type GetMyBusiness } from "~/utils/RouterTypes";
import Link from "next/link";
const Logo = ({ business }: { business: GetMyBusiness }) => {
  return (
    <div className=" flex-coll -center max-h-[20vh] max-w-[80vw] rounded-lg bg-accent-light p-4 text-white">
      <span className="text-center text-4xl font-bold">
        {business.business_name}
      </span>
      <span className="font-strong text-xl">{business.phone_number}</span>
      <span className="font-strong text-xl">{business.website}</span>
    </div>
  );
};

const Profile = () => {
  const [filter, setFilter] = useState("");
  const { data: business, isLoading } = api.business.getMyBusiness.useQuery();
  if (isLoading) {
    return (
      <div className="w-full p-8 text-center text-xl font-bold">
        Finding Business...
      </div>
    );
  }

  if (!business)
    return (
      <div className="flex flex-col place-items-center gap-2 p-8">
        <h1>Looks like you still need to </h1>
        <Link href={"/jobs"}>
          <p className="rounded-md bg-zinc-800 p-2 font-bold text-zinc-100">
            Setup Your Business
          </p>
        </Link>
      </div>
    );
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
        {jobs.length === 0 && (
          <div className="flex flex-col gap-2">
            <p>You have no jobs yet</p>
            <Link href={"/jobs"}>
              <p className="rounded-md bg-zinc-800 p-2 text-center font-bold text-zinc-100">
                Add Jobs
              </p>
            </Link>
          </div>
        )}
        {jobs.length > 0 &&
          jobs.filter((job) => job.isCompleted && job).length === 0 && (
            <div className="flex flex-col gap-2">
              <p>You have no completed jobs</p>
              <Link href={"/jobs"}>
                <p className="rounded-md bg-zinc-800 p-2 text-center font-bold text-zinc-100">
                  Manage Jobs
                </p>
              </Link>
            </div>
          )}
      </div>
      <div className="flex-coll -center gap-8">
        {jobs
          .filter((job) => job.isCompleted && job)
          .filter((job) =>
            job.Categories.some((c) => c.Category.name.includes(filter)),
          )
          .map((job) => (
            <JobPosting
              jobCategories={job.Categories.map((c) => c.Category)}
              key={job.job_id}
              zipcode={job.zip_code}
              date={new Date(job.date)}
              review={job.review}
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
