import React from "react";
import { api } from "~/utils/api";

const Jobs = () => {
  const { data: user } = api.user.getUser.useQuery();
  if (!user) return <p className="w-full text-center">Loading User Info..</p>;
  return (
    <div className="flex w-full flex-col items-center">
      {user.isBusiness && (
        <>
          <h1>Jobs</h1>
          <button className="rounded-md bg-accent p-2">Create Job</button>
        </>
      )}
    </div>
  );
};

export default Jobs;
