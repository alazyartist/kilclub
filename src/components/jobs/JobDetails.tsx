import { type Jobs } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import UploadMediaForm from "~/forms/UploadMediaForm";
import { api } from "~/utils/api";
import CategoryPopup from "../account/CategoryPopup";
import type { GetCategories, GetJobs } from "~/utils/RouterTypes";
import Image from "next/image";
import { MdCheckCircle, MdClose } from "../icons/MdIcons";
type JobType = GetJobs[0];
const JobDetails = ({
  job,
  visible,
  allCategories,
  business_id,
}: {
  job: JobType;
  visible?: boolean;
  allCategories: GetCategories;
  business_id: string;
}) => {
  const [showDetails, setShowDetails] = useState(visible);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [image, setImage] = useState<number | string>("");
  const images = job.media as string[];
  // const router = useRouter();
  // const image = router.query.image;
  return (
    <>
      {image !== "" && (
        <ImagePopover
          length={images.length}
          setImage={setImage}
          image={images[image]}
        />
      )}
      <div>
        <div
          key={job.job_id}
          className="relative min-w-[320px] rounded-md border-4 border-zinc-200 bg-zinc-100 p-2 text-zinc-900"
        >
          {showDetails ? (
            <>
              <div className="flex justify-between">
                <div onClick={() => setShowDetails(false)}>
                  <div>
                    {job.Categories.map((c) => (
                      <p
                        className="rounded-md bg-zinc-200 p-2 text-center font-bold"
                        key={c.id}
                      >
                        {c.Category.name}
                      </p>
                    ))}
                  </div>
                  <span>{job.customer_phone_number} </span>
                </div>
                <div className="flex flex-col">
                  <ActionsDropdown
                    job={job}
                    setCategoryFormOpen={setCategoryFormOpen}
                  />
                  <h1 className="text-right text-lg">{job.zip_code}</h1>
                  <p className="text-right text-xs">
                    {job.date.toDateString()}
                  </p>
                  <p className="place-self-end pt-2 text-xl">
                    {job.isReviewed ? (
                      <MdCheckCircle className="text-emerald-500" />
                    ) : (
                      <MdClose className="text-red-500" />
                    )}
                  </p>
                </div>
              </div>
              {Array.isArray(job.media) ? (
                <div className="grid h-full w-full grid-cols-3 gap-2 space-y-2 lg:grid-cols-8">
                  {job.media.map((img, index) => {
                    if (typeof img === "string") {
                      return (
                        <div
                          key={img}
                          className="relative flex flex-col items-center"
                        >
                          <Image
                            onClick={() => setImage(index)}
                            alt={`job_detail_${img}`}
                            className="aspect-square h-full w-full rounded-md object-cover drop-shadow-md"
                            src={img}
                            width={100}
                            height={100}
                          />
                          <DeleteMedia job={job} objectKey={img} />
                        </div>
                      );
                    }
                  })}
                  <UploadMediaForm job_id={job.job_id} />
                </div>
              ) : (
                <div className="grid h-full w-full grid-cols-3 gap-2 space-y-2 lg:grid-cols-8">
                  <UploadMediaForm job_id={job.job_id} />
                </div>
              )}
              <div className="mt-4 rounded-md bg-zinc-200 p-1">
                {job.review && <p className="text-sm">{job.review}</p>}
              </div>
            </>
          ) : (
            <div
              onClick={() => setShowDetails(true)}
              className="flex justify-between"
            >
              <div>
                <div>
                  {job.Categories.map((c) => (
                    <p
                      className="rounded-md bg-zinc-200 p-2 text-center font-bold"
                      key={c.id}
                    >
                      {c.Category.name}
                    </p>
                  ))}
                </div>
                <div className="flex place-content-center gap-2 place-self-end pt-1">
                  <p className="place-self-center text-right text-xs">
                    {job.date.toDateString()}
                  </p>
                  <p className="place-self-end text-xl">
                    {job.isReviewed ? (
                      <MdCheckCircle className="text-emerald-500" />
                    ) : (
                      <MdClose className="text-red-500" />
                    )}
                  </p>
                </div>
              </div>
              <h1 className="text-right text-lg">{job.zip_code}</h1>
            </div>
          )}
        </div>
        {/* {showDetails && (
          <div className=" flex justify-between gap-2 rounded-md border-4 border-zinc-200 bg-base-light px-1 py-2">
            {!job.isCompleted ? (
              <button
                onClick={() => markComplete({ job_id: job.job_id })}
                className="rounded-md bg-zinc-900 bg-opacity-20 p-2"
              >
                Mark Complete
              </button>
            ) : (
              <p className="p-2">Completed</p>
            )}
            <button
              onClick={() => setCategoryFormOpen(true)}
              className="rounded-md bg-zinc-900 bg-opacity-30 p-2"
            >
              Manage Categories
            </button>
            <DeleteJob job={job} />
          </div>
        )} */}
      </div>
      {categoryFormOpen && (
        <CategoryPopup
          type="job"
          job_id={job.job_id}
          close={setCategoryFormOpen}
          categories={allCategories}
          startCategories={job.Categories.map((c) => c.Category.name)}
          business_id={business_id}
        />
      )}
    </>
  );
};

export default JobDetails;

const ActionsDropdown = ({
  job,
  setCategoryFormOpen,
}: {
  job: Jobs;
  setCategoryFormOpen: React.Dispatch<React.SetStateAction<Boolean>>;
}) => {
  const { mutate: markComplete } = api.jobs.markComplete.useMutation();
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="relative w-[129px] text-xs lg:w-[169px] lg:text-base lg:text-zinc-900">
      {isOpen && (
        <div className="absolute left-0 top-10 z-20 flex w-[129px] flex-col justify-between gap-2 rounded-md border-4 border-zinc-200 bg-base-light px-1 py-2 lg:w-[169px]">
          {!job.isCompleted ? (
            <button
              onClick={() => markComplete({ job_id: job.job_id })}
              className="whitespace-nowrap rounded-md bg-zinc-900 bg-opacity-20 p-2 "
            >
              Mark Complete
            </button>
          ) : (
            <p className="p-2">Completed</p>
          )}
          <button
            onClick={() => setCategoryFormOpen(true)}
            className="whitespace-nowrap rounded-md bg-zinc-900 bg-opacity-30 p-2 "
          >
            Manage Categories
          </button>
          <button
            onClick={() => {
              navigator.share({
                url: `http://keep-it-local-club.vercel.app/review?pnid=%2B${job.customer_phone_number.slice(
                  1,
                )}`,
                title: `Review ${job.job_id}`,
              });

              console.log("gonna share");
            }}
          >
            Request Review
          </button>
          <DeleteJob job={job} />
        </div>
      )}
      <div>
        <p
          className="min-w-[69px] rounded-md bg-zinc-200 p-2"
          onClick={() => setOpen((prev) => !prev)}
        >
          actions <span>v</span>
        </p>
      </div>
    </div>
  );
};

const ImagePopover = ({ image, setImage, length }) => {
  const router = useRouter();
  return (
    <div className="flex-coll -center absolute left-0 top-0 h-screen w-screen ">
      <div className="z-10 flex max-h-[95vh] max-w-[95vw] place-items-center gap-2">
        <p
          onClick={() => setImage((prev) => (prev < 1 ? length - 1 : prev - 1))}
          className="rounded-full bg-zinc-200 bg-opacity-20 px-4 py-2 text-3xl font-black text-zinc-100"
        >
          &lt;
        </p>
        <Image
          alt={`popover_${image}`}
          width={1000}
          height={1000}
          className="obj h-full w-full rounded-md object-contain"
          src={image}
        />
        <p
          onClick={() => setImage((prev) => (prev + 1) % length)}
          className="rounded-full bg-zinc-200 bg-opacity-20 px-4 py-2 text-3xl font-black text-zinc-100"
        >
          &gt;
        </p>
      </div>
      <div
        onClick={() => setImage("")}
        className="fixed left-0 top-0 z-[2] h-screen w-screen bg-zinc-900 bg-opacity-30 backdrop-blur-md"
      />
    </div>
  );
};

const DeleteJob = ({ job }: { job: Jobs }) => {
  const { mutate: deleteJob } = api.jobs.deleteJob.useMutation();
  const [deleteCheck, setDeleteCheck] = useState(false);

  return (
    <>
      {deleteCheck ? (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setDeleteCheck(false)}
            className="min-w-[69px] rounded-md bg-emerald-500 p-2"
          >
            no
          </button>
          <button
            onClick={() => deleteJob({ job_id: job.job_id })}
            className="min-w-[69px] rounded-md bg-red-500 p-2"
          >
            yes
          </button>
        </div>
      ) : (
        <div className="rounded-md bg-accent">
          <button
            onClick={() => setDeleteCheck(true)}
            className="lg: w-full rounded-md bg-zinc-900 bg-opacity-20 p-2  text-zinc-100"
          >
            delete job
          </button>
        </div>
      )}
    </>
  );
};
const DeleteMedia = ({ job, objectKey }: { job: Jobs; objectKey: string }) => {
  const { mutate: deleteMedia } = api.jobs.deleteMedia.useMutation();

  const [deleteCheck, setDeleteCheck] = useState(false);
  return (
    <>
      {deleteCheck ? (
        <div className="absolute top-5 space-x-3">
          <button
            onClick={() =>
              deleteMedia({ job_id: job.job_id, objectKey: objectKey })
            }
            className="rounded-md bg-red-500 p-2"
          >
            yes
          </button>
          <button
            onClick={() => setDeleteCheck(false)}
            className="rounded-md bg-emerald-500 p-2"
          >
            no
          </button>
        </div>
      ) : (
        <button
          onClick={() => setDeleteCheck(true)}
          className="absolute right-0 top-0 rounded-bl-md rounded-tr-md bg-red-500 p-1 text-xs"
        >
          delete
        </button>
      )}
    </>
  );
};
