import React from "react";
import { api } from "~/utils/api";
import JobPosting from "~/components/JobPosting";
import JobDetails from "~/components/jobs/JobDetails";
import { Jobs } from "@prisma/client";

const photoFilenames = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
  "9.png",
  "10.png",
];

const jobs = [
  {
    jobid: 1111,
    location: "location_1",
    zipcode: 12345,
    star_rating: 1.1,
    date: "09/06/2023",
    photos: photoFilenames,
  },
  {
    jobid: 2222,
    location: "location_2",
    zipcode: 67890,
    star_rating: 2.2,
    date: "09/06/2023",
    photos: photoFilenames,
  },
];

const Logo = () => {
  return (
    <div className=" flex-coll -center max-h-[20vh] max-w-[80vw] rounded-lg bg-accent p-4 text-white">
      <span className="text-4xl font-bold">My Logo</span>
      <span className="font-strong text-2xl">(555) 867-5309</span>
      <span className="font-strong text-xl">businessname.com</span>
    </div>
  );
};

const Profile = () => {
  return (
    <div className="flex-coll -center gap-8 space-y-2 py-2">
      <Logo />
      <div className="flex-coll -center gap-8">
        {jobs.map((job) => (
          <>
            <FinishedJob key={job.jobid} business_id={"c5nnpmm10qb6pvrspy8sa3ks"} />
            <JobPosting
              key={job.jobid}
              location={job.location}
              zipcode={job.zipcode}
              star_rating={job.star_rating}
              date={new Date(job.date)}
              photos={job.photos}
            />
          </>
        ))}
      </div>
    </div>
  );
};

const FinishedJob = ({ business_id }: { business_id: string }) => {
  const { data } = api.business.getBusinessWithJobs.useQuery({
    business_id: business_id,
  });
  console.log("data: ", data);
  return (
    <div className="flex w-[95vw] flex-col gap-2 rounded-xl bg-zinc-200">
      <p className="p-2 text-3xl font-bold">Finished Jobs</p>
      {jobs?.map(
        (job: Jobs) =>
          job.isCompleted && (
            <JobDetails key={`jobdetail${job.job_id}`} job={job} />
          ),
      )}
      <p className="text-center text-xs">no more jobs to show</p>
    </div>
  );
};

export default Profile;
