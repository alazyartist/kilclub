import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ManageCategories from "~/components/account/ManageCategories";
import { api } from "~/utils/api";

const Account = () => {
  const stripe_customer_id = api.user.getStripeCustomer.useQuery();

  return (
    <div className="flex-coll gap-2 p-2">
      {stripe_customer_id && (
        <SubscriptionDetails
          stripe_customer_id={stripe_customer_id.data as string}
        />
      )}

      <div className="flex w-full content-center items-center gap-8 place-self-center rounded-md bg-accent p-2 ">
        <p className="text-sm text-zinc-100">Manage User Info {"->"}</p>
        <UserButton />
      </div>
      <ManageCategories />
    </div>
  );
};

export default Account;

const SubscriptionDetails = ({
  stripe_customer_id,
}: {
  stripe_customer_id: string;
}) => {
  const { data: user } = api.user.getUser.useQuery();
  const { mutate: createBillingPortal, data: billingPortalUrl } =
    api.payments.createBillingPortal.useMutation();
  const router = useRouter();
  useEffect(() => {
    if (billingPortalUrl) {
      router.push(billingPortalUrl);
    }
  }, [billingPortalUrl, router]);
  if (!user)
    return (
      <div className="w-full text-center">User Information Loading...</div>
    );
  const { subscription_tier: tier, subscription_status: status } = user;

  return (
    <div className="flex w-full min-w-[320px] justify-between place-self-center rounded-md bg-accent p-2">
      <div className="flex flex-col">
        <p className="text-xl font-bold text-zinc-100">{tier}</p>
        <p className="text-xs text-zinc-100">{status}</p>
      </div>
      <button
        onClick={() =>
          createBillingPortal({ stripe_customer_id: stripe_customer_id })
        }
        className="place-self-center rounded-xl bg-accent-light p-2 text-zinc-100"
      >
        Manage Subscription
      </button>
    </div>
  );
};
