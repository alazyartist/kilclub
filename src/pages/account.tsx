import { UserProfile } from "@clerk/nextjs";
import React from "react";
import { api } from "~/utils/api";

const Account = () => {
  const stripe_customer_id = api.user.getStripeCustomer.useQuery();
  const { mutate, data: billingPortalUrl } =
    api.payments.createBillingPortal.useMutation();
  return (
    <div className="flex-coll gap-2">
      {stripe_customer_id && (
        <button
          onClick={() =>
            mutate({ stripe_customer_id: stripe_customer_id.data as string })
          }
          className="place-self-center rounded-xl bg-accent-light p-2"
        >
          Manage Subscription
        </button>
      )}
      <p className="w-full overflow-x-scroll">
        {billingPortalUrl && billingPortalUrl}
      </p>
      <div className="flex w-full flex-col items-center ">
        <UserProfile />
      </div>
    </div>
  );
};

export default Account;
