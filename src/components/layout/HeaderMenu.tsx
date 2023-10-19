import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

const HeaderMenu = ({
  close,
}: {
  close: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex-coll fixed right-[5vw] top-10 z-10 w-[90vw] gap-2 rounded-md bg-base-light p-2 text-center text-zinc-900 lg:relative lg:-top-3 lg:flex lg:w-fit lg:flex-row lg:gap-8 lg:text-xl">
      <SignedIn>
        <PrivateMenu close={close} />
      </SignedIn>
      <SignedOut>
        <p onClick={() => close(false)}>
          <SignInButton mode="modal" />
        </p>
        <p onClick={() => close(false)}>
          <SignUpButton mode="modal" />
        </p>
        <MenuLink close={close} href="pricing" title="Pricing" />
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
  const router = useRouter();

  return (
    <Link
      onClick={() => close(false)}
      className={`${href === router.asPath ? "underline" : ""}`}
      href={href}
    >
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
          {(!user?.subscription_id ||
            user.subscription_status !== "active") && (
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
          <div className="place-self-center">
            <MenuLink
              close={close}
              href="/account"
              title={
                <div className="-center flex gap-2">
                  <Image
                    alt="user_profile_picture"
                    width={100}
                    height={100}
                    className="h-8 w-8 rounded-full"
                    src={clerkUser.user?.imageUrl}
                  />
                  <p>Manage Account</p>
                </div>
              }
            />
          </div>
        </>
      )}
    </>
  );
};
