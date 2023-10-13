import Link from "next/link";
import React from "react";
import { MdCheckCircle, MdClose } from "~/components/icons/MdIcons";
import Smiley from "~/components/layout/Icons";
import Logo from "~/components/layout/KilLogo";

const Pricing = () => {
  return (
    <div className="max-w-[90vw] place-self-center p-2">
      <div className="flex w-full place-content-center">
        <Logo className={"w-full p-2 lg:w-[50%]"} />
      </div>
      <div className="-center flex flex-col gap-8 pt-14">
        <p className="text-center text-3xl font-bold">
          Showcase your work
          <br /> in seconds
        </p>
        <Link
          href={"/register"}
          className="rounded-md bg-zinc-800 p-2 font-bold text-zinc-100"
        >
          Get Started
        </Link>
      </div>
      <SetupSteps />

      <div className="w-full bg-zinc-200 p-2">
        <p className="text-center text-xl font-bold">Pricing</p>
      </div>
      <PriceBreakdown />
    </div>
  );
};

export default Pricing;

const SetupSteps = () => {
  return (
    <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
      <li className="md:flex-1">
        <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
          <span className="text-sm font-medium text-accent-dark">Step 1</span>
          <span className="text-xl font-semibold">Sign up for an account</span>
          <span className="mt-2 text-zinc-700">
            Choose a plan that fits your business needs.
          </span>
        </div>
      </li>
      <li className="md:flex-1">
        <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
          <span className="text-sm font-medium text-accent-dark">Step 2</span>
          <span className="text-xl font-semibold">Create A Job</span>
          <span className="mt-2 text-zinc-700">
            All you need is the customers phone number and zip code
          </span>
        </div>
      </li>
      <li className="md:flex-1">
        <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
          <span className="text-sm font-medium text-accent-dark">Step 3</span>
          <span className="text-xl font-semibold">
            Upload Photos of Your Work
          </span>
          <span className="mt-2 text-zinc-700">
            from your phone or any device that has internet connection, we'll
            handle the rest
          </span>
        </div>
      </li>
      {/* <li className="md:flex-1">
        <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
          <span className="text-sm font-medium text-accent-dark">Step 4</span>
          <span className="text-xl font-semibold">Request A Review</span>
          <span className="mt-2 text-zinc-700">It&apos;s that simple.</span>
        </div>
      </li>
      <li className="md:flex-1">
        <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
          <span className="text-sm font-medium text-accent-dark">Step 5</span>
          <span className="text-xl font-semibold">Get New Leads</span>
          <span className="mt-2 text-zinc-700">
            We&apos;ll do the hard part of getting you in front of customers.
            Now your old jobs are advertising for you.
          </span>
        </div>
      </li> */}
    </ol>
  );
};

export const PriceBreakdown = () => {
  const pricingItems = [
    { feature: "Showcase your previous work", tier1: "yes", tier2: "yes" },
    { feature: "Collect social proof", tier1: "yes", tier2: "yes" },
    { feature: "Automatic messaging", tier1: "no", tier2: "yes" },
    { feature: "Unlimited uploads", tier1: "no", tier2: "yes" },
    { feature: "Featured section", tier1: "no", tier2: "yes" },
  ];
  return (
    <div className="rouded-sm grid grid-cols-3 gap-2 border-[3px] border-zinc-200 bg-zinc-100 p-4 md:text-2xl">
      <div
        className={`space-y-2 grid-rows-[${pricingItems.length}] grid content-center items-center`}
      >
        <p className="border-b-2 border-zinc-800 font-bold">features</p>
        {pricingItems.map((a) => (
          <p
            key={a.feature}
            className="h-[70px]  rounded-md p-2 text-xs odd:bg-zinc-300 md:text-2xl"
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
                // <MdCheckCircle className={"text-3xl text-emerald-500"} />
                <Smiley className={"w-[25px]"} />
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
                // <MdCheckCircle className={"text-3xl text-emerald-500"} />
                <Smiley className={"w-[25px]"} />
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
