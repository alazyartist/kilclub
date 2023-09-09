import {
  SignIn,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
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
        <PrivateMenu />
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
  title: string;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Link onClick={() => close(false)} className="" href={href}>
      {title}
    </Link>
  );
};

const PrivateMenu = () => {
  const { data: user } = api.user.getUser.useQuery();
  return (
    <>
      {user && (
        <>
          {!user?.subscription_id && (
            <MenuLink close={close} href="/upgrade" title="Upgrade" />
          )}
          {!user?.isBusiness && (
            <MenuLink close={close} href="/history" title="History" />
          )}
          {user?.isBusiness && (
            <MenuLink close={close} href="/jobs" title="Jobs" />
          )}
          <MenuLink close={close} href="/account" title="Account" />
          <div className="place-self-center">
            <UserButton afterSignOutUrl="https://localhost:3000" />
          </div>
        </>
      )}
    </>
  );
};
