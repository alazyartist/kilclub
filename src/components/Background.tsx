import React from "react";

const Background = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex min-h-[90vh] w-full flex-col bg-base-light text-zinc-900">
      {children}
    </div>
  );
};

export default Background;
