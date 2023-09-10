import React from "react";
import BusinessSetupForm from "~/forms/BusinessSetupForm";
import { api } from "~/utils/api";

const Jobs = () => {
  const { data: user } = api.user.getUser.useQuery();
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
          <button className="rounded-md bg-accent p-2">Create Job</button>
        </>
      )}
    </div>
  );
};

export default Jobs;

const BusinessDetail = ({ business_id }: { business_id: string }) => {
  const { data: businessInfo } = api.user.getBusiness.useQuery({ business_id });

  return (
    businessInfo && (
      <div>
        <p>{businessInfo?.business_name}</p>
        <p>{businessInfo?.phone_number}</p>
        <p>{businessInfo?.website}</p>
        <p>{businessInfo?.zip_code}</p>
      </div>
    )
  );
};
