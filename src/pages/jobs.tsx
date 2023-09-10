import React, { useState } from "react";
import BusinessSetupForm from "~/forms/BusinessSetupForm";
import { api } from "~/utils/api";
import JobCreationForm from "~/forms/JobCreationForm";
import BusinessDetail from "~/components/jobs/BusinessDetail";

const Jobs = () => {
  const { data: user } = api.user.getUser.useQuery();
  const [formOpen, setFormOpen] = useState(false);
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
          <h1>Jobs</h1>
          <BusinessDetail business_id={user.business_id} />
          {formOpen && (
            <JobCreationForm
              setFormOpen={setFormOpen}
              business_id={user.business_id}
            />
          )}
          {!formOpen && (
            <button
              onClick={() => setFormOpen(true)}
              className="rounded-md bg-accent p-2 text-zinc-100"
            >
              Create Job
            </button>
          )}
          <TestJobDisplay business_id={user.business_id} />
        </>
      )}
    </div>
  );
};

export default Jobs;

const TestJobDisplay = ({ business_id }: { business_id: string }) => {
  const { data: jobs } = api.jobs.getJobs.useQuery({
    business_id: business_id,
  });
  return (
    <div className="flex flex-col gap-2">
      {jobs?.map((job) => (
        <div className=" min-w-[320px] rounded-md bg-accent p-2 text-zinc-100">
          <h1 className="text-right text-lg">{job.zip_code}</h1>
          <div>{job.customer_phone_number}</div>
          <p className="text-right text-xs">{job.date.toDateString()}</p>
          <button className="rounded-md bg-accent-light p-2">Add Media</button>
        </div>
      ))}
    </div>
  );
};
