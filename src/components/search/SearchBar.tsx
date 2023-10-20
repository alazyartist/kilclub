import React from "react";
import AutoComplete from "./AutoComplete";
import { api } from "~/utils/api";

const SearchBar = ({
  zip_code,
  setZipCode,
}: {
  zip_code: string;
  setZipCode: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { data: businesses } = api.business.getBusinesses.useQuery();
  const { data: categories } = api.category.getCategories.useQuery();

  return (
    <div className="">
      <div className="-center w-fit flex-row lg:place-content-start ">
        <AutoComplete
          businesses={businesses}
          categories={categories}
          props={{
            placeholder: "how can we help?",
          }}
        />
        <input
          defaultValue={zip_code}
          onChange={(e) => setZipCode(e.target.value)}
          type="text"
          placeholder="zip"
          className="text-m w-[30vw] rounded-md px-5 py-3 font-bold text-zinc-900"
        />
      </div>
      <p className="pl-8 text-xs tracking-wider">find a solution now</p>
    </div>
  );
};

export default SearchBar;
