import {
  SignIn,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const HeaderMenu = () => {
  return (
    <div className="flex-coll bg-base-light fixed right-4 top-10 z-10 gap-2 rounded-md p-2 text-zinc-900">
      <SignedIn>
        <MenuLink href="/upgrade" title="Upgrade" />
        <MenuLink href="/history" title="History" />
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

const MenuLink = ({ href, title }: { href: string; title: string }) => {
  return (
    <Link className="" href={href}>
      {title}
    </Link>
  );
};
