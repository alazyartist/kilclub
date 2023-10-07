import React, { useState } from "react";
import BusinessSetupForm from "~/forms/BusinessSetupForm";
import { api } from "~/utils/api";
import JobCreationForm from "~/forms/JobCreationForm";
import BusinessDetail from "~/components/jobs/BusinessDetail";
import JobDetails from "~/components/jobs/JobDetails";
import { GetCategories } from "~/utils/RouterTypes";

const Jobs = () => {
  const { data: user } = api.user.getUser.useQuery();
  const [formOpen, setFormOpen] = useState(false);
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
          {formOpen && (
            <JobCreationForm
              setFormOpen={setFormOpen}
              business_id={user.business_id}
            />
          )}
          {/* <div className="flex"> */}
          {!formOpen && (
            <>
              <button
                onClick={() => setFormOpen(true)}
                className="rounded-md bg-accent p-2 text-zinc-100"
              >
                Create Job
              </button>
              <JobDisplay
                allCategories={allCategories}
                business_id={user.business_id}
              />
              <FinishedJobDisplay
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

const JobDisplay = ({
  business_id,
  allCategories,
}: {
  business_id: string;
  allCategories: GetCategories;
}) => {
  const { data: jobs } = api.jobs.getJobs.useQuery({
    business_id: business_id,
  });

  return (
    <div className="flex w-[95vw] flex-col gap-2 rounded-xl bg-zinc-200">
      <p className="p-2 text-3xl font-bold">Jobs</p>
      {jobs?.map(
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
}: {
  business_id: string;
  allCategories: GetCategories;
}) => {
  const { data: jobs } = api.jobs.getJobs.useQuery({
    business_id: business_id,
  });
  return (
    <div className="flex w-[95vw] flex-col gap-2 rounded-xl bg-zinc-200">
      <p className="p-2 text-3xl font-bold">Finished Jobs</p>
      {jobs?.map(
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
