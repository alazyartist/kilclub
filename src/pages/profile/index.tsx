import React from "react";
import JobPosting from "./JobPosting";

const jobs = [
  { jobid: 1111, location: "location_1", zipcode: 12345, star_rating: 1.1, date: "09/06/2023" },
  { jobid: 2222, location: "location_2", zipcode: 67890, star_rating: 2.2, date: "09/06/2023" }];

const Logo = () => {
  return (
    <div className="
      max-w-[80vw] max-h-[20vh] 
    bg-accent text-white
    p-4 rounded-lg
    flex-coll -center">
      <span className="font-bold text-4xl">My Logo</span>
      <span className="font-strong text-2xl">(555) 867-5309</span>
      <span className="font-strong text-xl">businessname.com</span>
    </div>
  )
}

const Profile = () => {
  return (
    <div className="h-full space-y-2 py-2 flex-coll -center">
      <Logo />
      <div>
        {jobs.map((job) => (
          <JobPosting 
            key={job.jobid}
            location={job.location}
            zipcode={job.zipcode}
            star_rating={job.star_rating}
            date={new Date(job.date)}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
