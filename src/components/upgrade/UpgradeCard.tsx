import React from "react";
import { api } from "~/utils/api";

interface UpgradeProps {
  upgrade: string;
  cost: string | number;
  discount?: number;
  description: string;
}
const UpgradeCard: React.FC<UpgradeProps> = ({
  upgrade,
  cost,
  discount,
  description,
}) => {
  const test = api.user.upgrade.useQuery();
  return (
    <div className="bg-accent max-w-[80vw] space-y-2 rounded-md p-4 text-white ">
      <div className="-center flex justify-between">
        <h1 className="p-2 text-xl font-bold">{upgrade}</h1>
        <div className="flex flex-col gap-1 p-2">
          <p
            className={`text-sm text-zinc-200 ${
              discount ? "text-xs text-zinc-300 line-through" : ""
            }`}
          >
            {cost}$
          </p>
          {discount && (
            <p className="text-sm font-bold text-zinc-200  ">{discount}$</p>
          )}
        </div>
      </div>
      <div className="text-accent-dark rounded-sm bg-zinc-200 p-2 text-sm ">
        {description}
      </div>
      <button className="bg-accent-light w-full rounded-md px-2 py-1 text-center">
        Upgrade Now
      </button>
    </div>
  );
};

export default UpgradeCard;
