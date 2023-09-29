import { type Jobs } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import UploadMediaForm from "~/forms/UploadMediaForm";
import { api } from "~/utils/api";

const JobDetails = ({ job, visible }: { job: Jobs; visible?: boolean }) => {
  const [showDetails, setShowDetails] = useState(visible);
  const { mutate: markComplete } = api.jobs.markComplete.useMutation();
  const router = useRouter();
  const image = router.query.image;
  return (
    <>
      {image && <ImagePopover image={image} />}
      <div
        key={job.job_id}
        className="relative min-w-[320px] rounded-md bg-accent p-2 text-zinc-100"
      >
        {showDetails ? (
          <>
            <div
              // onClick={() => setShowDetails(false)}
              className="flex justify-between"
            >
              <div>
                {job.customer_phone_number}{" "}
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
                  share
                </button>
              </div>
              <div>
                <h1 className="text-right text-lg">{job.zip_code}</h1>
                <p className="text-right text-xs">{job.date.toDateString()}</p>
              </div>
            </div>
            {Array.isArray(job.media) && (
              <div className="grid h-full w-full grid-cols-3 gap-2">
                {job.media.map((img) => {
                  if (typeof img === "string") {
                    return (
                      <div
                        key={img}
                        onClick={() => router.push(`?image=${img}`)}
                        className="flex flex-col items-center"
                      >
                        <img
                          alt={`job_detail_${img}`}
                          className="aspect-square h-full w-full rounded-md object-cover"
                          src={img}
                          width={100}
                          height={100}
                        />
                        <DeleteMedia job={job} objectKey={img} />
                      </div>
                    );
                  }
                })}
              </div>
            )}
            <div className="flex justify-between p-2">
              <UploadMediaForm job_id={job.job_id} />
              {!job.isCompleted && (
                <button
                  onClick={() => markComplete({ job_id: job.job_id })}
                  className="rounded-md bg-zinc-100 bg-opacity-20 p-2"
                >
                  Mark Complete
                </button>
              )}
              <DeleteJob job={job} />
            </div>
          </>
        ) : (
          <div
            onClick={() => setShowDetails(true)}
            className="flex justify-between"
          >
            <p className="place-self-end text-right text-xs">
              {job.date.toDateString()}
            </p>
            <h1 className="text-right text-lg">{job.zip_code}</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default JobDetails;

const ImagePopover = ({ image }) => {
  const router = useRouter();
  return (
    <div className="flex-coll -center absolute left-0 top-0 h-screen w-screen ">
      <div className="z-10 max-h-[95vh] max-w-[95vw]">
        <img
          alt={`popover_${image}`}
          className="obj h-full w-full rounded-md object-contain"
          src={image}
          width={100}
          height={100}
        />
      </div>
      <div
        onClick={() => router.push("/jobs")}
        className="fixed left-0 top-0 z-[2] h-full w-full bg-zinc-900 bg-opacity-30 backdrop-blur-md"
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
        <div>
          <button
            onClick={() => deleteJob({ job_id: job.job_id })}
            className="rounded-md bg-red-500 p-2"
          >
            yes
          </button>
          <button
            onClick={() => setDeleteCheck(false)}
            className="rounded-md bg-red-500 p-2"
          >
            no
          </button>
        </div>
      ) : (
        <button
          onClick={() => setDeleteCheck(true)}
          className="rounded-md bg-red-500 p-2"
        >
          delete job
        </button>
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
        <div>
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
            className="rounded-md bg-red-500 p-2"
          >
            no
          </button>
        </div>
      ) : (
        <button
          onClick={() => setDeleteCheck(true)}
          className="rounded-md bg-red-500 p-1 text-xs"
        >
          delete
        </button>
      )}
    </>
  );
};
