import React from "react";

const Background = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="bg-base-light flex min-h-screen flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default Background;
