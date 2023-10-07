import { useEffect, useState } from "react";
import { api } from "~/utils/api";

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
          } catch (err) {
            setMediaFormOpen(true);
            console.log("UPLOAD_FAILED");
            console.log(err);
          }
          console.log(files[i]);
          console.log(uploadUrls[i]);
        }
        setMediaFormOpen(false);
      }
    }
  }, [uploadUrls]);
  return (
    <form>
      {mediaFormOpen && (
        <div className="flex-coll -center absolute left-0 top-0 h-screen w-screen ">
          <div className="absolute top-2 z-20 flex flex-col gap-2 rounded-md bg-accent-light p-4 drop-shadow-md ">
            <input onChange={handleUpload} multiple type="file" />
            <button
              type="button"
              onClick={() => {
                setMediaFormOpen(false);
              }}
              className="rounded-md bg-zinc-900 bg-opacity-20 p-2 text-zinc-100"
            >
              cancel
            </button>
          </div>
          <div
            onClick={() => setMediaFormOpen(false)}
            className="fixed left-0 top-0 z-[2] h-full w-full bg-zinc-900 bg-opacity-30 backdrop-blur-md"
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          setMediaFormOpen(true);
        }}
        className="aspect-square h-full w-full rounded-md bg-accent-light p-2 text-5xl font-black drop-shadow-md"
      >
        +<p className="text-xs font-normal">add media</p>
      </button>
    </form>
  );
};

export default UploadMediaForm;
