import { UserButton, UserProfile } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ManageCategories from "~/components/account/ManageCategories";
import { api } from "~/utils/api";

const Account = () => {
  const stripe_customer_id = api.user.getStripeCustomer.useQuery();

  return (
    <div className="flex-coll gap-[0.75rem] p-2 lg:gap-[2rem]">
      {stripe_customer_id && (
        <SubscriptionDetails
          stripe_customer_id={stripe_customer_id.data as string}
        />
      )}

      <div className="flex h-full w-full content-center items-center justify-around place-self-center rounded-2xl  ">
        {/* <p className="text-sm text-zinc-100">Manage User Info {"->"}</p> */}
        <UserProfile
          appearance={{
            elements: {
              headerTitle: { display: "none" },
              headerSubtitle: { display: "none" },
              navbar: { display: "none" },
              page: { gap: 0, paddingTop: 0 },
              pageScrollBox: {
                gap: 0,
                paddingTop: 0,
                backgroundColor: "#f4f4f5",
              },
              profilePage: { justifyItems: "start" },
              navbarMobileMenuButton: { display: "none" },
              profilePage__security: { display: "none" },
              profilePage__account: {
                padding: 0,
                justifyContent: "space-between",
                gap: "2rem",
              },
            },
          }}
        />
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
    <div
      className="flex w-[55rem] min-w-[320px] max-w-[calc(100vw-0.75rem)] justify-between place-self-center rounded-md bg-base-light p-2 lg:max-w-[calc(100vw-5rem)]"
      style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 24px 48px" }}
    >
      <div className="flex flex-col">
        <p className="text-xl font-bold text-zinc-900">{tier}</p>
        <p className="text-xs text-zinc-700">{status}</p>
      </div>
      <button
        onClick={() =>
          createBillingPortal({ stripe_customer_id: stripe_customer_id })
        }
        className="place-self-center rounded-xl bg-accent-light p-2 text-white"
      >
        Manage Subscription
      </button>
    </div>
  );
};
