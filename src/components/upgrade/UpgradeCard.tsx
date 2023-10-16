import { useUser } from "@clerk/nextjs";
import React from "react";
import { api } from "~/utils/api";
import PaymentEmbed from "../payment/PaymentEmbed";
import Smiley from "../layout/Icons";

interface UpgradeProps {
  upgrade: string;
  cost: string | number;
  discount?: number;
  description?: string;
  price_id: "founder" | "local" | "premium";
  features?: string[];
}
const UpgradeCard: React.FC<UpgradeProps> = ({
  upgrade,
  cost,
  discount,
  features,
  description,
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
    <div className="flex min-h-[18rem] min-w-[320px] max-w-[80vw] flex-col space-y-2 rounded-md border-2 border-accent bg-base-light p-4 text-accent drop-shadow-lg lg:min-h-[22rem] lg:min-w-[420px] ">
      <div className="-center flex h-full justify-between">
        <h1 className="place-self-start p-2 text-3xl font-bold text-zinc-900">
          {upgrade}
        </h1>
        <div className="flex flex-col gap-1 p-2">
          <p
            className={`text-right text-sm  ${
              discount ? "text-xs  line-through" : ""
            }`}
          >
            {cost}$/<span className="text-[10px]">month</span>
          </p>
          {discount && (
            <p className=" text-5xl font-bold   ">
              {discount}$/<span className="text-[10px]">month</span>
            </p>
          )}
        </div>
      </div>
      {description && (
        <div className="h-full w-full flex-1 ">{description}</div>
      )}
      {features && (
        <div className="flex h-full w-full flex-1 flex-col place-items-center ">
          {features &&
            features.map((f) => (
              <p className="w-[80%] space-x-2 text-xl lg:min-w-[65%]">
                <Smiley className={"inline h-6 w-6"} />
                <span className="text-zinc-900">{f}</span>
              </p>
            ))}
        </div>
      )}
      {!subscription && (
        <>
          {/* <div className="rounded-sm bg-zinc-200 p-2 text-sm text-accent-dark ">
            {description}
          </div> */}
          <button
            onClick={() => createCustomer()}
            className="w-full rounded-md bg-accent-light px-2 py-1 text-center text-2xl text-zinc-100"
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
