import React, { useState } from "react";
import HeaderMenu from "./HeaderMenu";
import Link from "next/link";
import Logotype from "./Logotype";

const Header = () => {
  const [isOpen, openMenu] = useState(false);
  return (
    <header>
      <div className="sticky top-0 flex w-full justify-between border-b-2 border-accent bg-base-light p-2 py-2 pb-2 lg:border-b-4 lg:py-4">
        <Link
          onClick={() => openMenu(false)}
          href={"/"}
          className="flex place-items-center text-4xl font-extrabold tracking-tighter text-accent-light sm:text-[5rem] lg:text-6xl"
        >
          <Logotype className={"h-8 w-fit"} />
          {/* keep<span className="text-accent-dark">it</span>local.club */}
        </Link>
        <p
          onClick={() => openMenu((prev) => !prev)}
          className="w-12 p-2 text-3xl font-bold lg:hidden lg:w-16"
        >
          <HamburgerSVG />
        </p>
        <div className="hidden lg:inline">
          <HeaderMenu close={openMenu} />
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden ">
          <HeaderMenu close={openMenu} />
        </div>
      )}
    </header>
  );
};

export default Header;

const HamburgerSVG = () => {
  return (
    <svg viewBox="0 0 10 8" width="100%">
      <path
        className="stroke-accent   hover:stroke-accent-dark"
        d="M1 1h8M1 4h 8M1 7h8"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
};
