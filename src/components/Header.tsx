import React, { useState } from "react";
import HeaderMenu from "./HeaderMenu";
import Link from "next/link";

const Header = () => {
  const [isOpen, openMenu] = useState(true);
  return (
    <>
      <div className="border-accent fixed top-0 flex w-full justify-between border-b-2 p-2 pb-4 ">
        <Link
          href={"/"}
          className="text-accent-light text-4xl font-extrabold tracking-tighter sm:text-[5rem]"
        >
          Keep <span className="text-accent-dark">it</span> Local
        </Link>
        <p
          onClick={() => openMenu((prev) => !prev)}
          className="p-2 text-3xl font-bold"
        >
          <HamburgerSVG />
        </p>
      </div>
      {isOpen && <HeaderMenu />}
    </>
  );
};

export default Header;

const HamburgerSVG = ({ ...props }) => {
  return (
    <svg viewBox="0 0 10 8" width="40">
      <path
        className="stroke-accent hover:stroke-accent-dark"
        d="M1 1h8M1 4h 8M1 7h8"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
};
