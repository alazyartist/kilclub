import { useForm } from "react-hook-form";
import React from "react";
import { api } from "~/utils/api";

type FormData = {
  business_name: string;
  phone_number: string;
  website?: string;
  zip_code: string;
};
const BusinessSetupForm = () => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const handleFinalSubmit = async (data: FormData) => {
    console.log(data);
    mutate(data);
  };

  const { mutate } = api.user.createBusiness.useMutation();

  return (
    <form
      onSubmit={handleSubmit(handleFinalSubmit)}
      className="flex-coll min-w-[320px] gap-2 p-2"
    >
      <input
        className="w-full rounded-md p-2"
        placeholder="business_name"
        {...register("business_name", { required: "Business Name Required" })}
      />
      {errors && <ErrorText error={errors?.business_name?.message} />}
      <input
        type="tel"
        className="w-full rounded-md p-2"
        placeholder="phone_number"
        {...register("phone_number", {
          required: "(xxx)-xxx-xxxx",
          minLength: 10,
          maxLength: 14,
          setValueAs: (value) => "+1" + value.replace(/\D/g, ""),
          onChange: (e) => {
            setValue("phone_number", formatPhoneNumber(e.target.value));
          },
        })}
      />
      {errors && <ErrorText error={errors?.phone_number?.message} />}
      <input
        className="w-full rounded-md p-2"
        placeholder="website"
        {...register("website")}
      />
      {errors && <ErrorText error={errors?.website?.message} />}
      <input
        className="w-full rounded-md p-2"
        placeholder="zip_code"
        {...register("zip_code", {
          required: "must be valid zip",
          minLength: 5,
        })}
      />
      {errors && <ErrorText error={errors?.zip_code?.message} />}
      <button className="rounded-md bg-accent p-2">Add Business</button>
    </form>
  );
};

const ErrorText = ({ error }: { error: string | null | undefined }) => {
  return <>{error && <p className="text-xs text-red-500">{error}</p>}</>;
};

export default BusinessSetupForm;

export function formatPhoneNumber(input: string) {
  // Remove all non-numeric characters
  const numericInput = input.replace(/\D/g, "");

  // Apply the phone number format
  const formattedPhoneNumber = numericInput.replace(
    /(\d{3})(\d{3})(\d{4})(.*)/,
    "($1)-$2-$3",
  );

  return formattedPhoneNumber;
}
