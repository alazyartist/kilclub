import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
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
  }, [data]);

  return (
    <form
      onSubmit={handleSubmit(handleFinalSubmit)}
      className="flex-coll min-w-[320px] gap-2 rounded-md bg-accent p-2"
    >
      <div className="flex justify-between">
        <p className="pl-1 text-zinc-100">create new job</p>
        <button
          onClick={() => setFormOpen(false)}
          className="rounded-md bg-red-500 p-2 font-bold text-zinc-100"
        >
          cancel
        </button>
      </div>
      <input
        type="tel"
        className="rounded-md p-2"
        placeholder="customer phone number"
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
      <input
        className="rounded-md p-2"
        placeholder="zip code"
        {...register("zip_code", {
          required: "must be valid zip",
          minLength: 5,
        })}
      />
      <input
        type="date"
        className="rounded-md p-2"
        placeholder="date"
        {...register("date")}
      />

      <button className="rounded-md bg-accent-light p-2 font-bold text-zinc-100">
        Create Job
      </button>
    </form>
  );
};

export default JobCreationForm;