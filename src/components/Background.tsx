import React from "react";

const Background = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="bg-base-light flex h-screen flex-col items-center justify-center text-zinc-900">
      {children}
    </div>
  );
};

export default Background;
