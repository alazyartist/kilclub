import React from "react";
import UpgradeCard from "~/components/upgrade/UpgradeCard";

const Customer = () => {
  return (
    <div className="flex h-full min-h-[100vh] w-full flex-col items-center space-y-2 py-2">
      <UpgradeCard
        cost={1}
        description="Support Local Businesses!."
        upgrade="Local"
        price_id="local"
      />
    </div>
  );
};

export default Customer;
