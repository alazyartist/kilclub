import {
  SignIn,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { User } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";

const HeaderMenu = ({
  close,
}: {
  close: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex-coll fixed right-4 top-10 z-10 gap-2 rounded-md bg-base-light p-2 text-zinc-900">
      <SignedIn>
        <PrivateMenu close={close} />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
    </div>
  );
};

export default HeaderMenu;

const MenuLink = ({
  href,
  title,
  close,
}: {
  href: string;
  title: string | React.ReactNode;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Link onClick={() => close(false)} className="" href={href}>
      {title}
    </Link>
  );
};

const PrivateMenu = ({
  close,
}: {
  close: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: user } = api.user.getUser.useQuery();
  const clerkUser = useUser();
  return (
    <>
      {user && (
        <>
          {!user?.subscription_id || user.subscription_status === "canceled" && (
            <MenuLink close={close} href="/upgrade" title="Upgrade" />
          )}
          {!user?.isBusiness && (
            <MenuLink close={close} href="/history" title="History" />
          )}
          {user?.isBusiness && (
            <>
              <MenuLink close={close} href="/jobs" title="Jobs" />
              <MenuLink close={close} href="/profile" title="Profile" />
            </>
          )}
          <MenuLink
            close={close}
            href="/account"
            title={
              <img
                width={100}
                height={100}
                className="h-8 w-8 rounded-full"
                src={clerkUser.user?.imageUrl}
              />
            }
          />
          <div className="place-self-center"></div>
        </>
      )}
    </>
  );
};
