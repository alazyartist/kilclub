import React from "react";

const Background = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="bg-base-light flex-col">
      {children}
    </div>
  );
};

export default Background;
