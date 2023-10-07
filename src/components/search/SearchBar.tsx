import React from "react";
import AutoComplete from "./AutoComplete";
import { api } from "~/utils/api";

const SearchBar = () => {
  const { data: businesses } = api.business.getBusinesses.useQuery();
  const { data: categories } = api.category.getCategories.useQuery();

  return (
    <div className="lg:pl-36">
      <div className="-center w-fit flex-row gap-4 lg:place-content-start ">
        {/* <label className="whitespace-nowrap font-bold text-primary-dark">
        Zip Code:{" "}
      </label> */}
        {/* <input
        className="border-2 border-primary-dark"
        onKeyPress={(event) => {
          if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
          }
        }}
      /> */}
        <AutoComplete
          businesses={businesses}
          categories={categories}
          props={{
            placeholder: "how can we help?",
          }}
        />
        <button className="text-m rounded-md bg-accent px-5 py-3 font-bold text-white">
          Search
        </button>
      </div>
      <p className="pl-8 text-xs tracking-wider">find a solution now</p>
    </div>
  );
};

export default SearchBar;
