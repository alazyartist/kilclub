import React from "react";
import { MdCheckCircle, MdClose } from "~/components/icons/MdIcons";

const Pricing = () => {
  return (
    <div className="p-2">
      <div className="w-full bg-zinc-200 p-2">
        <p className="text-center text-xl font-bold">Pricing</p>
      </div>
      <PriceBreakdown />
    </div>
  );
};

export default Pricing;

export const PriceBreakdown = () => {
  const pricingItems = [
    { feature: "showcase your previous work", tier1: "yes", tier2: "yes" },
    { feature: "collect social proof", tier1: "yes", tier2: "yes" },
    { feature: "automatic messaging", tier1: "no", tier2: "yes" },
    { feature: "unlimited uploads", tier1: "no", tier2: "yes" },
    { feature: "featured section", tier1: "no", tier2: "yes" },
  ];
  return (
    <div className="rouded-sm grid grid-cols-3 gap-2 border-[3px] border-zinc-200 bg-zinc-100 p-4">
      <div
        className={`space-y-2 grid-rows-[${pricingItems.length}] grid content-center items-center`}
      >
        <p className="border-b-2 border-zinc-800 font-bold">features</p>
        {pricingItems.map((a) => (
          <p
            key={a.feature}
            className="h-[70px]  rounded-md p-2 text-sm odd:bg-zinc-300"
          >
            {a.feature}
          </p>
        ))}
      </div>
      <div
        className={`space-y-2 grid-rows-[${pricingItems.length}] grid content-center items-center`}
      >
        <p className="text-center">Basic</p>
        {pricingItems.map((a) => (
          <div
            key={`tier1${a.feature}`}
            className="flex h-[70px] w-full place-content-center place-items-center rounded-md p-2 text-center odd:bg-zinc-300"
          >
            <p>
              {a.tier1 === "yes" && (
                <MdCheckCircle className={"text-3xl text-emerald-500"} />
              )}
            </p>
          </div>
        ))}
      </div>
      <div
        className={`space-y-2 grid-rows-[${pricingItems.length}] grid content-center items-center`}
      >
        <p className="text-center">Premium</p>
        {pricingItems.map((a) => (
          <div
            key={`tier2${a.feature}`}
            className="flex  h-[70px] w-full place-content-center place-items-center rounded-md p-2 odd:bg-zinc-300"
          >
            <p>
              {a.tier2 === "yes" && (
                <MdCheckCircle className={"text-3xl text-emerald-500"} />
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
