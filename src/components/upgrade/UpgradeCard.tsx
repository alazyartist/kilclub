import { useUser } from "@clerk/nextjs";
import React from "react";
import { api } from "~/utils/api";
import PaymentEmbed from "../payment/PaymentEmbed";

interface UpgradeProps {
  upgrade: string;
  cost: string | number;
  discount?: number;
  description: string;
  price_id: "founder" | "local";
}
const UpgradeCard: React.FC<UpgradeProps> = ({
  upgrade,
  cost,
  discount,
  price_id,
}) => {
  const { mutate, data: subscription } =
    api.payments.createCustomerSubscription.useMutation();
  const { user } = useUser();
  const name = user?.firstName + " " + user?.lastName;
  const email = user?.primaryEmailAddress?.emailAddress;
  const createCustomer = () => {
    if (!email || !name) return;
    mutate({ email, name, price_id });
  };
  return (
    <div className="min-w-[320px] max-w-[80vw] space-y-2 rounded-md bg-accent p-4 text-white ">
      <div className="-center flex justify-between">
        <h1 className="p-2 text-xl font-bold">{upgrade}</h1>
        <div className="flex flex-col gap-1 p-2">
          <p
            className={`text-right text-sm text-zinc-200 ${
              discount ? "text-xs text-zinc-300 line-through" : ""
            }`}
          >
            {cost}$/<span className="text-[10px]">month</span>
          </p>
          {discount && (
            <p className=" text-5xl font-bold text-zinc-200  ">
              {discount}$/<span className="text-[10px]">month</span>
            </p>
          )}
        </div>
      </div>
      {!subscription && (
        <>
          {/* <div className="rounded-sm bg-zinc-200 p-2 text-sm text-accent-dark ">
            {description}
          </div> */}
          <button
            onClick={() => createCustomer()}
            className="w-full rounded-md bg-accent-light px-2 py-1 text-center"
          >
            Upgrade Now
          </button>
        </>
      )}
      {subscription && subscription.paid && (
        <div>
          <h1 className="text-center text-lg font-bold">Already a member</h1>
          <p className="text-xs">
            To manage your membership
            <br /> please use the account settings
          </p>
        </div>
      )}
      {subscription && !subscription.paid && (
        <div>
          {subscription && (
            <PaymentEmbed clientSecret={subscription.clientSecret} />
          )}
        </div>
      )}
    </div>
  );
};

export default UpgradeCard;
