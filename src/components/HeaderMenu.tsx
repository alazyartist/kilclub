import {
  SignIn,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const HeaderMenu = ({
  close,
}: {
  close: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex-coll bg-base-light fixed right-4 top-10 z-10 gap-2 rounded-md p-2 text-zinc-900">
      <SignedIn>
        <MenuLink close={close} href="/upgrade" title="Upgrade" />
        <MenuLink close={close} href="/history" title="History" />
        <MenuLink close={close} href="/profile" title="Profile" />
        <div className="place-self-center">
          <UserButton />
        </div>
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
