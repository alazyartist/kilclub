import Link from "next/link";
import React from "react";

const UpgradeFlow = () => {
  return (
    <div className="flex-coll h-full w-full items-center gap-2">
      <h1 className="pt-14 text-2xl font-bold">I am a</h1>
      <Link
        className="bg-accent-light w-[200px] rounded-md p-2 text-center text-white"
        href="/upgrade/customer"
      >
        Customer
      </Link>
      <Link
        className="bg-accent-light w-[200px] rounded-md p-2 text-center text-white"
        href="/upgrade/business"
      >
        Business
      </Link>
    </div>
  );
};

export default UpgradeFlow;
