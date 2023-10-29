import React, { useState } from "react";
import BusinessSetupForm from "~/forms/BusinessSetupForm";
import { api } from "~/utils/api";
import JobCreationForm from "~/forms/JobCreationForm";
import BusinessDetail from "~/components/jobs/BusinessDetail";
import JobDetails from "~/components/jobs/JobDetails";
import { type GetCategories } from "~/utils/RouterTypes";
import { MdCheckCircle, MdClose } from "~/components/icons/MdIcons";
import { Circle } from "~/components/layout/Icons";
import UpgradeCard from "~/components/upgrade/UpgradeCard";

const Jobs = () => {
  const { data: user } = api.user.getUser.useQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [filter, setFilter] = useState("");
  const { data: allCategories } = api.category.getCategories.useQuery();

  if (!user) return <p className="w-full text-center">Loading User Info..</p>;
  if (user.subscription_status !== "active")
    return (
      <InactiveSubscription
        tier={user.subscription_tier}
        status={user.subscription_status}
      />
    );

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {!user.business_id && user.subscription_status === "active" && (
        <BusinessSetupForm />
      )}
      {user.business_id && (
        <>
          <BusinessDetail business_id={user.business_id} />
          <div className="">
            <CategoryFilter
              filter={filter}
              setFilter={setFilter}
              reviewFilter={reviewFilter}
              setReviewFilter={setReviewFilter}
            >
              <button className="">
                <div className="p-1">
                  <Circle
                    //TODO: Replace with Category Adder
                    onClick={() => { console.log("Add Category") }}
                    className={" h-[50px] w-[50px] place-self-end"}
                  />
                </div>
              </button>
            </CategoryFilter>
          </div>
          {formOpen && (
            <JobCreationForm
              setFormOpen={setFormOpen}
              business_id={user.business_id}
            />
          )}

          <div className="mb-2">
            <JobDisplay
              filter={filter}
              reviewFilter={reviewFilter}
              allCategories={allCategories}
              business_id={user.business_id}
            >
              <button className="">
                <div className="p-1">
                  <Circle
                    onClick={() => setFormOpen(true)}
                    className={" h-[50px] w-[50px] place-self-end"}
                  />
                </div>
              </button>
            </JobDisplay>
          </div>
        </>
      )}
    </div>
  );
};
export default Jobs;

const CategoryFilter = ({
  setFilter,
  filter,
  reviewFilter,
  setReviewFilter,
  children,
}: {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
  reviewFilter: string;
  setReviewFilter: React.Dispatch<React.SetStateAction<string>>;
  children: React.ReactNode;
}) => {
  const { data: categories } = api.category.getBusinessCategories.useQuery();

  return (
    <div className="relative flex w-[95vw] flex-col gap-2 rounded-xl bg-zinc-200 px-2 border-2 border-accent-light">
      <div className="flex justify-between pr-2">
        <p className="p-2 text-3xl font-bold lg:pl-2 lg:pt-2">Categories</p>
        {children}
      </div>
      <div className="flex flex-col justify-center drop-shadow-lg relative min-w-[320px] rounded-lg border-[1px] border-white bg-zinc-100 p-2 mb-2 text-zinc-900">
        <div className="w-full flex justify-center flex-wrap gap-2 py-2 text-xs md:text-lg">
          {Array.isArray(categories) &&
            categories.map((c) => (
              <p
                key={c.id}
                className={`border-white border-2 rounded-md bg-zinc-200 p-2 ${filter === c.Category.name
                  ? "ring-2 ring-accent-light ring-offset-2 "
                  : ""
                  }`}
                onClick={() => { setFilter((prev) => prev !== c.Category.name ? c.Category.name : ""); }}
              >
                {c.Category.name}
              </p>
            ))
          }
        </div>
        <div className="">
          <p className={`border-white border-2 text-center bg-zinc-200 p-1 rounded-md text-xs md:text-lg
            ${reviewFilter === "reviewed" ? "bg-green-500 " : reviewFilter === "unreviewed" ? "bg-red-300 " : ""}`}
            onClick={() => { 
              console.log("reviewFilter: " + reviewFilter) 
              switch (reviewFilter) {
                case "reviewed":
                  setReviewFilter("unreviewed");
                  break;
                case "unreviewed":
                  setReviewFilter("all");
                  break;
                default:
                  setReviewFilter("reviewed");
                  break;
              }
            }}
          >Reviewed</p>
        </div>
      </div>
    </div>
  );
};

const JobDisplay = ({
  business_id,
  allCategories,
  reviewFilter,
  filter,
  children,
}: {
  filter: string;
  business_id: string;
  allCategories: GetCategories;
  reviewFilter: string;
  children?: React.ReactNode;
}) => {
  const { data: jobs } = api.jobs.getJobs.useQuery({
    business_id: business_id,
  });

  return (
    <div className="relative flex w-[95vw] flex-col gap-2 rounded-xl bg-zinc-200 px-2 border-2 border-accent-light">
      <div className="flex justify-between pr-2">
        <p className="p-2 text-3xl font-bold lg:pl-2 lg:pt-2">Jobs</p>
        {children}
      </div>
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2">
        {jobs
          ?.filter((job) => {
            if (reviewFilter === "reviewed") {
              return job.isReviewed && job;
            } else if (reviewFilter === "unreviewed") {
              return !job.isReviewed && job;
            } else if (reviewFilter === "all") {
              return job;
            } else {
              return job;
            }
          })
          .filter((job) => {
            if (filter) {
              return job.Categories.some((c) =>
                c.Category.name.includes(filter),
              );
            } else {
              return job;
            }
          })
          .map((job) => (
            <JobDetails
              business_id={business_id}
              allCategories={allCategories}
              visible={true}
              key={`jobdetail${job.job_id}`}
              job={job}
            />
          ))}
      </div>
      <p className="place-self-center p-2 text-center text-xs">
        no more jobs to show
      </p>
    </div>
  );
};
// const FinishedJobDisplay = ({
//   business_id,
//   allCategories,
//   checkisreviewed,
//   checkisnotreviewed,
//   filter,
// }: {
//   filter: string;
//   business_id: string;
//   allCategories: GetCategories;
//   checkisreviewed: boolean;
//   checkisnotreviewed: boolean;
// }) => {
//   const { data: jobs } = api.jobs.getJobs.useQuery({
//     business_id: business_id,
//   });
//   return (
//     <div className="flex w-[95vw] flex-col gap-2 rounded-xl bg-zinc-200">
//       <p className="p-2 text-3xl font-bold">Finished Jobs</p>
//       {jobs
//         ?.filter((job) => {
//           if (!!checkisreviewed && !checkisnotreviewed) {
//             return !job.isReviewed && job;
//           } else if (!!checkisnotreviewed && !checkisreviewed) {
//             return job.isReviewed && job;
//           } else if (!!checkisnotreviewed && !!checkisreviewed) {
//             return job;
//           } else {
//             return job;
//           }
//         })
//         .filter((job) => {
//           if (filter) {
//             return job.Categories.some((c) => c.Category.name.includes(filter));
//           } else {
//             return job;
//           }
//         })
//         .map(
//           (job) =>
//             job.isCompleted && (
//               <JobDetails
//                 business_id={business_id}
//                 allCategories={allCategories}
//                 key={`jobdetail${job.job_id}`}
//                 job={job}
//               />
//             ),
//         )}
//       <p className="text-center text-xs">no more jobs to show</p>
//     </div>
//   );
// };

const InactiveSubscription = ({ status, tier }) => {
  const getSubscription = (tier) => {
    switch (tier) {
      case "founder":
        return (
          <UpgradeCard
            cost={45}
            discount={15}
            // description="Unlock the potential for business growth and community engagement with our 'Founder' tier. Build with us and get a lifetime of savings, expand your reach, and elevate your business to new heights within our vibrant community."
            features={["showcase your work", "collect social proof"]}
            upgrade="Founder"
            price_id="founder"
          />
        );
        break;

      case "premium":
        return (
          <UpgradeCard
            cost={150}
            discount={50}
            features={[
              "showcase your work",
              "collect social proof",
              "automatic messaging",
              "unlimited uploads",
            ]}
            // description="Unlock the potential for business growth and community engagement with our 'Premium' tier. Build with us and get a lifetime of savings, expand your reach, and elevate your business to new heights within our vibrant community."
            upgrade="Premium"
            price_id="founder"
          />
        );
        break;
    }
  };
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="space-y-4">
        <div>
          <h1 className="text-center text-4xl font-black">Oh No,</h1>
          <p className="text-center ">
            it looks like
            <br /> your <span className="font-bold">{tier}</span> subscription
            is <span className="font-bold">{status}</span>
          </p>
        </div>
        {getSubscription(tier)}
        {/* <p className="rounded-md bg-zinc-800 p-2 font-bold text-zinc-100">
        Upgrade
      </p> */}
      </div>
    </div>
  );
};
