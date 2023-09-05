import React from "react";

const Header = () => {
  return (
    <div className="border-accent flex justify-between border-b-2 p-2 pb-4">
      <h1 className="text-accent-light text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Keep <span className="text-accent-dark">it</span> Local
      </h1>
      <p className="p-2 text-3xl font-bold">x</p>
    </div>
  );
};

export default Header;
