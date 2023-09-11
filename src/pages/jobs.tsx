import React, { useEffect, useState } from "react";
import BusinessSetupForm from "~/forms/BusinessSetupForm";
import { api } from "~/utils/api";
import JobCreationForm from "~/forms/JobCreationForm";
import BusinessDetail from "~/components/jobs/BusinessDetail";
import { Jobs } from "@prisma/client";

const Jobs = () => {
  const { data: user } = api.user.getUser.useQuery();
  const [formOpen, setFormOpen] = useState(false);
  if (!user) return <p className="w-full text-center">Loading User Info..</p>;
  return (
    <div className="flex w-full flex-col items-center gap-2">
      {!user.business_id && (
        <>
          <h1>Business Setup</h1>
          <BusinessSetupForm />
        </>
      )}
      {user.business_id && (
        <>
          <h1>Jobs</h1>
          <BusinessDetail business_id={user.business_id} />
          {formOpen && (
            <JobCreationForm
              setFormOpen={setFormOpen}
              business_id={user.business_id}
            />
          )}
          {!formOpen && (
            <button
              onClick={() => setFormOpen(true)}
              className="rounded-md bg-accent p-2 text-zinc-100"
            >
              Create Job
            </button>
          )}
          <TestJobDisplay business_id={user.business_id} />
        </>
      )}
    </div>
  );
};

export default Jobs;

const TestJobDisplay = ({ business_id }: { business_id: string }) => {
  const { data: jobs } = api.jobs.getJobs.useQuery({
    business_id: business_id,
  });
  const { mutate: deleteJob } = api.jobs.deleteMedia.useMutation();
  return (
    <div className="flex flex-col gap-2">
      {jobs?.map((job) => (
        <div
          key={job.job_id}
          className=" min-w-[320px] rounded-md bg-accent p-2 text-zinc-100"
        >
          <h1 className="text-right text-lg">{job.zip_code}</h1>
          <div>{job.customer_phone_number}</div>
          <p className="text-right text-xs">{job.date.toDateString()}</p>
          {Array.isArray(job.media) && (
            <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-2">
              {job.media.map((img) => (
                <div className="h-full">
                  <img
                    key={img as string}
                    className="aspect-auto h-full w-full rounded-md"
                    src={img as string}
                    width={100}
                    height={100}
                  />
                  <button
                    onClick={() =>
                      deleteJob({
                        job_id: job.job_id,
                        objectKey: img as string,
                      })
                    }
                  >
                    delete
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between">
            <UploadMediaForm job_id={job.job_id} />
            <DeleteJob job={job} />
          </div>
        </div>
      ))}
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
          delete
        </button>
      )}
    </>
  );
};

const UploadMediaForm = ({ job_id }: { job_id: string }) => {
  const [mediaFormOpen, setMediaFormOpen] = useState(false);
  const [files, setFiles] = useState<File[]>();
  const { mutate: createUrl, data: uploadUrls } =
    api.jobs.uploadMedia.useMutation();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
      console.log("setting file");
      console.log(files);
    }
  };
  useEffect(() => {
    if (files) {
      console.log("file Exists");
      console.log(files);
      createUrl({ filenames: files.map((file) => file.name), job_id: job_id });
      console.log(uploadUrls);
    }
  }, [files]);
  useEffect(() => {
    if (uploadUrls && uploadUrls.length > 0 && files) {
      console.log("Ready To Upload");
      for (let i = 0; i < uploadUrls.length; i++) {
        if (uploadUrls[i] && files[i]) {
          try {
            const upload_url = new URL(uploadUrls[i] as string);
            fetch(upload_url, {
              body: files[i],
              method: "PUT",
              //@ts-ignore
              headers: { "Content-Type": files[i].type },
            });
            setMediaFormOpen(false);
          } catch (err) {
            setMediaFormOpen(true);
            console.log("UPLOAD_FAILED");
            console.log(err);
          }
          console.log(files[i]);
          console.log(uploadUrls[i]);
        }
      }
    }
  }, [uploadUrls]);
  return (
    <form>
      {mediaFormOpen && <input onChange={handleUpload} multiple type="file" />}
      <button
        type="button"
        onClick={() => {
          setMediaFormOpen(true);
        }}
        className="rounded-md bg-accent-light p-2"
      >
        Add Media
      </button>
    </form>
  );
};
