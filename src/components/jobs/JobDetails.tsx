import { type Jobs } from "@prisma/client";
import { useState } from "react";
import UploadMediaForm from "~/forms/UploadMediaForm";
import { api } from "~/utils/api";
import CategoryPopup from "../account/CategoryPopup";
import type { GetCategories, GetJobs } from "~/utils/RouterTypes";
import Image from "next/image";
import { MdCheckCircle, MdClose } from "../icons/MdIcons";
import Smiley, { CaretDown } from "../layout/Icons";
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

  return (
    <>
      {image !== "" && (
        <ImagePopover
          images={images}
          setImage={setImage}
          image={images[image]}
        />
      )}
      <div
        key={job.job_id}
        className="drop-shadow- relative min-w-[320px] rounded-lg border-[1px] border-white bg-zinc-100 p-2 text-zinc-900"
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
                  {job.Categories.length === 0 && (
                    <button
                      onClick={() => setCategoryFormOpen(true)}
                      className="rounded-md bg-emerald-200 p-2 text-center font-bold"
                    >
                      Add Category
                    </button>
                  )}
                </div>
                <span>{job.customer_phone_number} </span>
              </div>
              <div className="flex flex-col">
                <ActionsDropdown
                  job={job}
                  setCategoryFormOpen={setCategoryFormOpen}
                />
                <h1 className="text-right text-lg">{job.zip_code}</h1>
                <p className="text-right text-xs">{job.date.toDateString()}</p>
                <p className="place-self-end pt-2 text-xl">
                  {job.isReviewed ? (
                    <div className="flex items-center gap-1 text-xs">
                      {/* <MdCheckCircle className="inline text-emerald-500" />{" "} */}
                      <Smiley className={"h-6 w-6"} />
                      Review
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs">
                      <MdClose className="inline text-red-500" /> Review
                    </div>
                  )}
                </p>
              </div>
            </div>
            {Array.isArray(job.media) ? (
              <div className="grid h-fit w-full grid-cols-3 gap-2 lg:grid-cols-6 ">
                {job.media.map((img, index) => {
                  if (typeof img === "string") {
                    return (
                      <div
                        key={img}
                        className="relative flex aspect-square flex-col items-center"
                      >
                        <Image
                          onClick={() => setImage(index)}
                          alt={`job_detail_${img}`}
                          className="aspect-square h-full w-full rounded-md border-[1px] border-white object-cover drop-shadow-md"
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
              <div className="grid h-fit w-full grid-cols-3 gap-2 space-y-2 lg:grid-cols-6">
                <UploadMediaForm job_id={job.job_id} />
              </div>
            )}
            {job.review && (
              <div className="mt-4 rounded-md bg-zinc-200 p-1">
                <p className="text-sm">{job.review}</p>
              </div>
            )}
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
                {job.Categories.length === 0 && (
                  <button
                    onClick={() => setCategoryFormOpen(true)}
                    className="rounded-md bg-emerald-200 p-2 text-center font-bold"
                  >
                    Add Category
                  </button>
                )}
              </div>
              <div className="flex place-content-center gap-2 place-self-end pt-1">
                <p className="place-self-center text-right text-xs">
                  {job.date.toDateString()}
                </p>
                <p className="place-self-end text-xl">
                  {job.isReviewed ? (
                    <div className="flex items-center gap-1 text-xs">
                      {/* <MdCheckCircle className="inline text-emerald-500" />{" "} */}
                      <Smiley className={"h-6 w-6"} />
                      Review
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs">
                      <MdClose className="inline text-red-500" /> Review
                    </div>
                  )}
                </p>
              </div>
            </div>
            <h1 className="text-right text-lg">{job.zip_code}</h1>
          </div>
        )}
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
    <div className="relative w-[129px] flex-1 text-xs lg:w-[169px] lg:text-base lg:text-zinc-900">
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
        <div
          className="flex min-w-[69px] justify-around rounded-md border-[1px] border-white bg-zinc-200 p-2 drop-shadow-sm"
          onClick={() => setOpen((prev) => !prev)}
        >
          <p className="flex gap-1">
            actions{" "}
            <span>
              <CaretDown className={"inline w-[12px]"} />{" "}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const ImagePopover = ({ image, setImage, images }) => {
  return (
    <div className="flex-coll -center fixed left-0 top-0 z-10 h-screen w-screen ">
      <div className="z-30 flex max-h-[95vh] max-w-[90vw] place-items-center gap-2">
        {images.length > 1 && (
          <p
            onClick={() =>
              setImage((prev) => (prev < 1 ? images.length - 1 : prev - 1))
            }
            className="absolute -left-1 rounded-full bg-zinc-200 bg-opacity-20 px-4 py-2 text-3xl font-black text-zinc-100 backdrop-blur-md"
          >
            &lt;
          </p>
        )}
        <Image
          alt={`popover_${image}`}
          width={1000}
          height={1000}
          className="obj h-full w-full rounded-md object-contain"
          src={image}
        />
        {images.length > 1 && (
          <p
            onClick={() => setImage((prev) => (prev + 1) % images.length)}
            className="absolute -right-1 rounded-full bg-zinc-200 bg-opacity-20 px-4 py-2 text-3xl font-black text-zinc-100 backdrop-blur-md"
          >
            &gt;
          </p>
        )}
      </div>
      <div
        onClick={() => setImage("")}
        className="absolute left-0 top-0 z-[20] h-screen w-screen bg-zinc-900 bg-opacity-30 backdrop-blur-md"
      />
      {images.length > 1 && (
        <div className="z-20 flex gap-2 p-2">
          {images.map((a, i) => (
            <div
              onClick={() => setImage(i)}
              key={a}
              className={`h-8 w-8 rounded-full bg-primary-light `}
            >
              {a === image && <Smiley />}
            </div>
          ))}
        </div>
      )}
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
        <div className="rounded-md bg-red-500">
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
          className="absolute right-0 top-0 rounded-bl-md rounded-tr-md border-r-[1px] border-t-[1px] border-white bg-red-500 p-1 text-xs"
        >
          delete
        </button>
      )}
    </>
  );
};
