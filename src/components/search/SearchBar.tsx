import React from "react";
import AutoComplete from "./AutoComplete";

const SearchBar = () => {
  return (
    <div className="-center flex-row gap-4">
      <label className="font-bold text-primary-dark">Zip Code: </label>
      {/* <input
        className="border-2 border-primary-dark"
        onKeyPress={(event) => {
          if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
          }
        }}
      /> */}
      <AutoComplete props={{ autoFocus: true }} />
      <button className="text-m rounded-full bg-primary-dark px-2 py-1 font-bold text-white">
        Search
      </button>
    </div>
  );
};

export default SearchBar;