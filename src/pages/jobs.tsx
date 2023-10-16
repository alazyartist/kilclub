import React, { useState } from "react";
import BusinessSetupForm from "~/forms/BusinessSetupForm";
import { api } from "~/utils/api";
import JobCreationForm from "~/forms/JobCreationForm";
import BusinessDetail from "~/components/jobs/BusinessDetail";
import JobDetails from "~/components/jobs/JobDetails";
import { type GetCategories } from "~/utils/RouterTypes";
import { MdCheckCircle, MdClose } from "~/components/icons/MdIcons";
import Smiley, { Circle } from "~/components/layout/Icons";
const Jobs = () => {
  const { data: user } = api.user.getUser.useQuery();
  const [formOpen, setFormOpen] = useState(false);
  const [checkisreviewed, setCheckisreviewed] = useState(true);
  const [checkisnotreviewed, setCheckisnotreviewed] = useState(true);
  const [filter, setFilter] = useState("");

  const { data: allCategories } = api.category.getCategories.useQuery();
  if (!user) return <p className="w-full text-center">Loading User Info..</p>;
  return (
    <div className="flex w-full flex-col items-center gap-2">
      {!user.business_id && (
        <div className="flex h-[85vh] flex-col place-content-center">
          <BusinessSetupForm />
        </div>
      )}
      {user.business_id && (
        <>
          <BusinessDetail business_id={user.business_id} />
          <div className="flex gap-3">
            <CategoryFilter filter={filter} setFilter={setFilter} />
            <FinishedFilter
              checkisreviewed={checkisreviewed}
              setCheckisreviewed={setCheckisreviewed}
              checkisnotreviewed={checkisnotreviewed}
              setCheckisnotreviewed={setCheckisnotreviewed}
            />
          </div>
          {formOpen && (
            <JobCreationForm
              setFormOpen={setFormOpen}
              business_id={user.business_id}
            />
          )}
          {/* <div className="flex"> */}
          {/* <div className="flex gap-2  ">
            {["Manage", "Job", "See Profile"].map((a) => (
              <p className="whitespace-nowrap rounded-md bg-zinc-200 p-2">
                {a}
              </p>
            ))}
          </div> */}

          <>
            <JobDisplay
              filter={filter}
              checkisreviewed={checkisreviewed}
              checkisnotreviewed={checkisnotreviewed}
              allCategories={allCategories}
              business_id={user.business_id}
            >
              <button className="absolute right-4 top-[-25px] z-10 mr-4">
                <div className="p-1">
                  <Circle
                    onClick={() => setFormOpen(true)}
                    className={" h-[50px] w-[50px] place-self-end"}
                  />
                  <p className="text-xs">add job</p>
                </div>
              </button>
            </JobDisplay>
            {/* <FinishedJobDisplay
              filter={filter}
              checkisreviewed={checkisreviewed}
              checkisnotreviewed={checkisnotreviewed}
              allCategories={allCategories}
              business_id={user.business_id}
            /> */}
          </>
          {/* </div> */}
        </>
      )}
    </div>
  );
};

export default Jobs;
const FinishedFilter = ({
  checkisreviewed,
  setCheckisreviewed,
  setCheckisnotreviewed,
  checkisnotreviewed,
}) => {
  return (
    <div className="flex place-items-center gap-3 text-5xl">
      <p onClick={() => setCheckisreviewed((prev) => !prev)}>
        <MdCheckCircle
          className={`${
            checkisreviewed ? "text-emerald-200" : "text-emerald-500"
          }`}
        />
      </p>
      <p onClick={() => setCheckisnotreviewed((prev) => !prev)}>
        <MdClose
          className={`${checkisnotreviewed ? "text-red-200" : "text-red-500"}`}
        />
      </p>
    </div>
  );
};
const CategoryFilter = ({
  setFilter,
  filter,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { data: categories } = api.category.getBusinessCategories.useQuery();
  return (
    <div className="flex max-w-[70vw] flex-wrap gap-2 py-2 text-xs md:text-lg">
      {Array.isArray(categories) &&
        categories.map((c) => (
          <p
            key={c.id}
            className={`rounded-md bg-zinc-200 p-2 ${
              filter === c.Category.name
                ? "ring-2 ring-accent-light ring-offset-2 "
                : ""
            }`}
            onClick={() => {
              setFilter((prev) =>
                prev !== c.Category.name ? c.Category.name : "",
              );
            }}
          >
            {c.Category.name}
          </p>
        ))}
    </div>
  );
};

const JobDisplay = ({
  business_id,
  allCategories,
  checkisreviewed,
  checkisnotreviewed,
  filter,
  children,
}: {
  filter: string;
  business_id: string;
  allCategories: GetCategories;
  checkisreviewed: boolean;
  checkisnotreviewed: boolean;
  children?: React.ReactNode;
}) => {
  const { data: jobs } = api.jobs.getJobs.useQuery({
    business_id: business_id,
  });

  return (
    <div className="relative flex w-[95vw] flex-col gap-2 rounded-xl bg-zinc-200 px-2 ">
      <p className="p-2 text-3xl font-bold lg:pl-2 lg:pt-2">Jobs</p>
      {children}
      <div className="flex flex-col gap-2 lg:grid lg:grid-cols-2">
        {jobs
          ?.filter((job) => {
            if (!!checkisreviewed && !checkisnotreviewed) {
              return !job.isReviewed && job;
            } else if (!!checkisnotreviewed && !checkisreviewed) {
              return job.isReviewed && job;
            } else if (!!checkisnotreviewed && !!checkisreviewed) {
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
      <p className="place-self-center text-center text-xs">
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
