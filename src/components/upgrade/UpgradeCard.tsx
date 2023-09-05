import React from "react";

interface UpgradeProps {
  upgrade: string;
  cost: string | number;
  description: string;
}
const UpgradeCard: React.FC<UpgradeProps> = ({
  upgrade,
  cost,
  description,
}) => {
  return (
    <div className="bg-accent max-w-[80vw] rounded-md p-4 text-white ">
      <div className="-center flex justify-between">
        <h1 className="p-2 text-xl font-bold">{upgrade}</h1>
        <p className="p-2 text-xs text-zinc-200  ">{cost}$</p>
      </div>
      <div className="text-accent-dark rounded-sm bg-zinc-200 p-2 text-sm ">
        {description}
      </div>
    </div>
  );
};

export default UpgradeCard;
