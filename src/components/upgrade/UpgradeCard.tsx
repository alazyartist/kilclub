import { useClerk, useUser } from "@clerk/nextjs";
import React from "react";
import { api } from "~/utils/api";
import PaymentEmbed from "../payment/PaymentEmbed";

interface UpgradeProps {
  upgrade: string;
  cost: string | number;
  discount?: number;
  description: string;
}
const UpgradeCard: React.FC<UpgradeProps> = ({
  upgrade,
  cost,
  discount,
  description,
}) => {
  const { mutate, data: customer_id } =
    api.payments.createCustomer.useMutation();
  const { user, isSignedIn } = useUser();
  console.log(user?.firstName, user?.lastName);
  const name = user?.firstName + " " + user?.lastName;
  const email = user?.primaryEmailAddress?.emailAddress;
  const createCustomer = () => {
    if (!email || !name) return;
    mutate({ email, name });
  };
  return (
    <div className="max-w-[80vw] space-y-2 rounded-md bg-accent p-4 text-white ">
      <div className="-center flex justify-between">
        <h1 className="p-2 text-xl font-bold">{upgrade}</h1>
        <div className="flex flex-col gap-1 p-2">
          <p
            className={`text-sm text-zinc-200 ${
              discount ? "text-xs text-zinc-300 line-through" : ""
            }`}
          >
            {cost}$
          </p>
          {discount && (
            <p className="text-sm font-bold text-zinc-200  ">{discount}$</p>
          )}
        </div>
      </div>
      <div className="rounded-sm bg-zinc-200 p-2 text-sm text-accent-dark ">
        {description}
      </div>
      <button
        onClick={() => createCustomer()}
        className="w-full rounded-md bg-accent-light px-2 py-1 text-center"
      >
        Upgrade Now
      </button>
      {customer_id && (
        <div>
          {customer_id && (
            <PaymentEmbed clientSecret={customer_id.clientSecret} />
          )}
        </div>
      )}
    </div>
  );
};

export default UpgradeCard;
