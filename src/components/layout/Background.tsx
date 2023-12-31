import React from "react";

const Background = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="grainy flex min-h-[92vh] w-full flex-col bg-base-light text-zinc-900">
      {children}
    </div>
  );
};

export default Background;
