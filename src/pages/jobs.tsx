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
  const [file, setFile] = useState<File>();
  const { mutate: createUrl, data: uploadUrl } =
    api.jobs.uploadMedia.useMutation();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      console.log("setting file");
      console.log(file);
    }
  };
  useEffect(() => {
    if (file) {
      console.log("file Exists");
      console.log(file);
      createUrl({ filename: file.name, job_id: job_id });
      console.log(uploadUrl);
    }
  }, [file]);
  useEffect(() => {
    if (uploadUrl && file) {
      console.log("Ready To Upload");
      try {
        fetch(uploadUrl, {
          body: file,
          method: "PUT",
          headers: { "Content-Type": file.type },
        });
        setMediaFormOpen(false);
      } catch (err) {
        setMediaFormOpen(true);
        console.log("UPLOAD_FAILED");
        console.log(err);
      }
      console.log(file);
      console.log(uploadUrl);
    }
  }, [uploadUrl]);
  return (
    <form>
      {mediaFormOpen && <input onChange={handleUpload} type="file" />}
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
