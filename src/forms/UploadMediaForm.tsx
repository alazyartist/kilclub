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
        <div className="absolute top-2 z-20 flex flex-col gap-2 rounded-md bg-accent-light p-4">
          <input onChange={handleUpload} multiple type="file" />
          <button
            type="button"
            onClick={() => {
              setMediaFormOpen(false);
            }}
            className="rounded-md bg-red-500 p-2"
          >
            cancel
          </button>
        </div>
      )}
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

export default UploadMediaForm;
