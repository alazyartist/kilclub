import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { api } from "~/utils/api";
import { formatPhoneNumber } from "./BusinessSetupForm";

type FormData = {
  customer_phone_number: string;
  zip_code: string;
  date: Date;
};

const JobCreationForm = ({
  business_id,
  setFormOpen,
}: {
  business_id: string;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const { mutate: createJob, data } = api.jobs.createJob.useMutation();
  const handleFinalSubmit = async (data: FormData) => {
    console.log(data);
    createJob({
      ...data,
      business_id: business_id,
      date: new Date(data.date),
    });
  };
  useEffect(() => {
    if (!data) return;
    if (data.status === "Job Created") setFormOpen(false);
  }, [data, setFormOpen]);

  return (
    <div className="-center absolute left-0 top-0 z-20 flex h-full w-full ">
      <form
        onSubmit={handleSubmit(handleFinalSubmit)}
        className="flex min-w-[320px] flex-col gap-4 rounded-md bg-white p-8 drop-shadow-xl"
      >
        <div className="flex justify-between">
          <div className="p-2">
            <h1 className="text-xl font-semibold">Create a new job</h1>
            <h1 className="font-light">to start collecting social proof</h1>
          </div>
          <button
            onClick={() => setFormOpen(false)}
            className="rounded-md bg-red-500 p-2 font-bold text-zinc-100"
          >
            cancel
          </button>
        </div>
        <div>
          <label
            htmlFor="customer_phone_number"
            className="text-sm font-semibold"
          >
            Customer Phone Number
          </label>
          <input
            autoComplete="tel"
            type="tel"
            className="w-full rounded-md border-[1px] border-zinc-200 p-2"
            // placeholder="customer phone number"
            {...register("customer_phone_number", {
              required: "(xxx)-xxx-xxxx",
              minLength: 10,
              maxLength: 14,
              setValueAs: (value) => "+1" + value.replace(/\D/g, ""),
              onChange: (e) => {
                setValue(
                  "customer_phone_number",
                  formatPhoneNumber(e.target.value),
                );
              },
            })}
          />
        </div>
        <div>
          <label htmlFor="zip_code" className="text-sm font-semibold">
            Zip Code
          </label>
          <input
            autoComplete="postal_code"
            className="w-full rounded-md border-[1px] border-zinc-200 p-2"
            // placeholder="zip code"
            {...register("zip_code", {
              required: "must be valid zip",
              minLength: 5,
            })}
          />
        </div>
        <div>
          <label htmlFor="date" className="text-sm font-semibold">
            Date
          </label>
          <input
            type="date"
            className="w-full rounded-md border-[1px] border-zinc-200 p-2"
            // placeholder="date"
            {...register("date")}
          />
        </div>
        <button className="rounded-md bg-accent-light p-2 font-bold text-white">
          Create Job
        </button>
      </form>
      <div
        onClick={() => setFormOpen(false)}
        className="absolute z-[-1] h-full w-full bg-zinc-900 bg-opacity-30 backdrop-blur-sm"
      />
    </div>
  );
};

export default JobCreationForm;
