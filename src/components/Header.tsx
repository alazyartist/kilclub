import React, { useState } from "react";
import HeaderMenu from "./HeaderMenu";
import Link from "next/link";

const Header = () => {
  const [isOpen, openMenu] = useState(true);
  return (
    <header>
      <div className="sticky top-0 flex w-full justify-between border-b-2 border-accent bg-base-light p-2 py-2 pb-2 lg:border-b-4 lg:py-4">
        <Link
          onClick={() => openMenu(false)}
          href={"/"}
          className="text-4xl font-extrabold tracking-tighter text-accent-light sm:text-[5rem] lg:text-6xl"
        >
          keep<span className="text-accent-dark">it</span>local.club
        </Link>
        <p
          onClick={() => openMenu((prev) => !prev)}
          className="w-12 p-2 text-3xl font-bold lg:w-16"
        >
          <HamburgerSVG />
        </p>
      </div>
      {isOpen && <HeaderMenu close={openMenu} />}
    </header>
  );
};

export default Header;

const HamburgerSVG = () => {
  return (
    <svg viewBox="0 0 10 8" width="100%">
      <path
        className="stroke-accent hover:stroke-accent-dark"
        d="M1 1h8M1 4h 8M1 7h8"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
};
