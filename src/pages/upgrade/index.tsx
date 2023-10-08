import Link from "next/link";
import React from "react";

const UpgradeFlow = () => {
  return (
    <div className="flex-coll -center space-y-2 p-4">
      <h1 className="pt-14 text-2xl font-bold lg:text-5xl">I am a</h1>
      <div className="flex gap-4">
        <Link
          className="w-full max-w-[320px] rounded-xl bg-accent p-4 text-white lg:text-3xl"
          href="/upgrade/customer"
        >
          <h3 className="text-2xl font-bold">Customer</h3>
        </Link>
        <Link
          className="w-full max-w-[320px]  rounded-xl bg-accent p-4 text-white lg:text-3xl"
          href="/upgrade/business"
        >
          <h3 className="text-2xl font-bold">Business</h3>
        </Link>
      </div>
    </div>
  );
};

export default UpgradeFlow;
