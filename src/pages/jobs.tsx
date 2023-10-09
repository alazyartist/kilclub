import React, { useState } from "react";
import BusinessSetupForm from "~/forms/BusinessSetupForm";
import { api } from "~/utils/api";
import JobCreationForm from "~/forms/JobCreationForm";
import BusinessDetail from "~/components/jobs/BusinessDetail";
import JobDetails from "~/components/jobs/JobDetails";
import { type GetCategories } from "~/utils/RouterTypes";
import { MdCheckCircle, MdClose } from "~/components/icons/MdIcons";

const Jobs = () => {
  const { data: user } = api.user.getUser.useQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [checkisreviewed, setCheckisreviewed] = useState(false);
  const [checkisnotreviewed, setCheckisnotreviewed] = useState(false);
  const [filter, setFilter] = useState("");

  const { data: allCategories } = api.category.getCategories.useQuery();
  if (!user) return <p className="w-full text-center">Loading User Info..</p>;
  return (
    <div className="flex w-full flex-col items-center gap-2">
      {!user.business_id && (
        <>
          <h1>Business Setup</h1>
          <BusinessSetupForm />
        </>
      )}
      {user.business_id && (
        <>
          <BusinessDetail business_id={user.business_id} />
          <div className="flex gap-3">
            <CategoryFilter filter={filter} setFilter={setFilter} />
            <FinishedFilter
              checkisreviewed={checkisreviewed}
              setCheckisreviewed={setCheckisreviewed}
              checkisnotreviewed={checkisnotreviewed}
              setCheckisnotreviewed={setCheckisnotreviewed}
            />
          </div>
          {formOpen && (
            <JobCreationForm
              setFormOpen={setFormOpen}
              business_id={user.business_id}
            />
          )}
          {/* <div className="flex"> */}
          {/* <div className="flex gap-2  ">
            {["Manage", "Job", "See Profile"].map((a) => (
              <p className="whitespace-nowrap rounded-md bg-zinc-200 p-2">
                {a}
              </p>
            ))}
          </div> */}
          {!formOpen && (
            <>
              <button
                onClick={() => setFormOpen(true)}
                className="mr-4 place-self-end rounded-full bg-accent px-4 py-2 text-4xl font-bold text-zinc-100 lg:mr-8"
              >
                <div className="p-1">
                  +<p className="hidden text-xs lg:block">add job</p>
                </div>
              </button>
              <JobDisplay
                filter={filter}
                checkisreviewed={checkisreviewed}
                checkisnotreviewed={checkisnotreviewed}
                allCategories={allCategories}
                business_id={user.business_id}
              />
              <FinishedJobDisplay
                filter={filter}
                checkisreviewed={checkisreviewed}
                checkisnotreviewed={checkisnotreviewed}
                allCategories={allCategories}
                business_id={user.business_id}
              />
            </>
          )}
          {/* </div> */}
        </>
      )}
    </div>
  );
};

export default Jobs;
const FinishedFilter = ({
  checkisreviewed,
  setCheckisreviewed,
  setCheckisnotreviewed,
  checkisnotreviewed,
}) => {
  return (
    <div className="flex place-items-center gap-3 text-5xl">
      <p onClick={() => setCheckisreviewed((prev) => !prev)}>
        <MdCheckCircle
          className={`${
            checkisreviewed ? "text-emerald-200" : "text-emerald-500"
          }`}
        />
      </p>
      <p onClick={() => setCheckisnotreviewed((prev) => !prev)}>
        <MdClose
          className={`${checkisnotreviewed ? "text-red-200" : "text-red-500"}`}
        />
      </p>
    </div>
  );
};
const CategoryFilter = ({
  setFilter,
  filter,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { data: categories } = api.category.getBusinessCategories.useQuery();
  return (
    <div className="flex gap-2 py-2">
      {Array.isArray(categories) &&
        categories.map((c) => (
          <p
            className={`rounded-md bg-zinc-200 p-2 shadow-sm ${
              filter === c.Category.name
                ? "shadow-accent-light "
                : "shadow-zinc-500"
            }`}
            onClick={() => {
              setFilter((prev) =>
                prev !== c.Category.name ? c.Category.name : "",
              );
            }}
          >
            {c.Category.name}
          </p>
        ))}
    </div>
  );
};

const JobDisplay = ({
  business_id,
  allCategories,
  checkisreviewed,
  checkisnotreviewed,
  filter,
}: {
  filter: string;
  business_id: string;
  allCategories: GetCategories;
  checkisreviewed: boolean;
  checkisnotreviewed: boolean;
}) => {
  const { data: jobs } = api.jobs.getJobs.useQuery({
    business_id: business_id,
  });

  return (
    <div className="flex w-[95vw] flex-col gap-2 rounded-xl bg-zinc-200">
      <p className="p-2 text-3xl font-bold">Jobs</p>
      {jobs
        ?.filter((job) => {
          if (!!checkisreviewed && !checkisnotreviewed) {
            return !job.isReviewed && job;
          } else if (!!checkisnotreviewed && !checkisreviewed) {
            return job.isReviewed && job;
          } else if (!!checkisnotreviewed && !!checkisreviewed) {
            return job;
          } else {
            return job;
          }
        })
        .filter((job) => {
          if (filter) {
            return job.Categories.some((c) => c.Category.name.includes(filter));
          } else {
            return job;
          }
        })
        .map(
          (job) =>
            !job.isCompleted && (
              <JobDetails
                business_id={business_id}
                allCategories={allCategories}
                visible={true}
                key={`jobdetail${job.job_id}`}
                job={job}
              />
            ),
        )}
      <p className="text-center text-xs">no more jobs to show</p>
    </div>
  );
};
const FinishedJobDisplay = ({
  business_id,
  allCategories,
  checkisreviewed,
  checkisnotreviewed,
  filter,
}: {
  filter: string;
  business_id: string;
  allCategories: GetCategories;
  checkisreviewed: boolean;
  checkisnotreviewed: boolean;
}) => {
  const { data: jobs } = api.jobs.getJobs.useQuery({
    business_id: business_id,
  });
  return (
    <div className="flex w-[95vw] flex-col gap-2 rounded-xl bg-zinc-200">
      <p className="p-2 text-3xl font-bold">Finished Jobs</p>
      {jobs
        ?.filter((job) => {
          if (!!checkisreviewed && !checkisnotreviewed) {
            return !job.isReviewed && job;
          } else if (!!checkisnotreviewed && !checkisreviewed) {
            return job.isReviewed && job;
          } else if (!!checkisnotreviewed && !!checkisreviewed) {
            return job;
          } else {
            return job;
          }
        })
        .filter((job) => {
          if (filter) {
            return job.Categories.some((c) => c.Category.name.includes(filter));
          } else {
            return job;
          }
        })
        .map(
          (job) =>
            job.isCompleted && (
              <JobDetails
                business_id={business_id}
                allCategories={allCategories}
                key={`jobdetail${job.job_id}`}
                job={job}
              />
            ),
        )}
      <p className="text-center text-xs">no more jobs to show</p>
    </div>
  );
};
