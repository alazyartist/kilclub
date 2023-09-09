import React, { useState } from "react";
import HeaderMenu from "./HeaderMenu";
import Link from "next/link";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";

const Header = () => {
  const [isOpen, openMenu] = useState(false);
  return (
    <header>
      <div className="sticky top-0 flex w-full justify-between border-b-2 border-accent bg-base-light p-2 pb-4 ">
        <Link
          onClick={() => openMenu(false)}
          href={"/"}
          className="text-4xl font-extrabold tracking-tighter text-accent-light sm:text-[5rem]"
        >
          keep<span className="text-accent-dark">it</span>local.club
        </Link>
        <p
          onClick={() => openMenu((prev) => !prev)}
          className="p-2 text-3xl font-bold"
        >
          <HamburgerSVG />
        </p>
      </div>
      {isOpen && <HeaderMenu close={openMenu} />}
    </header>
  );
};

export default Header;

const HamburgerSVG = ({ ...props }) => {
  return (
    <svg viewBox="0 0 10 8" width="40">
      <path
        className="stroke-accent hover:stroke-accent-dark"
        d="M1 1h8M1 4h 8M1 7h8"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
};
