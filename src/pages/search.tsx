import { type BusinessInfo } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

const Search = () => {
  const router = useRouter();
  const { sq: query } = router.query;
  return (
    <div className="flex w-full flex-col">
      <p className="w-ful p-4 text-center text-lg text-zinc-800">
        Here&apos;s what we found for:{" "}
        <span className="font-bold underline">{query}</span>
      </p>
      <SearchResults query={Array.isArray(query) ? query[0] : query} />
    </div>
  );
};

export default Search;

const SearchResults = ({ query }: { query: string }) => {
  const { data } = api.business.findBusinessSearch.useQuery({ query: query });
  if (!data) return <div>Loading Search</div>;
  if (data.length < 1) {
    return <div className="w-full text-center">No results for {query}</div>;
  }

  return (
    <div>
      {data.map((business) => (
        <Link
          key={business.business_id}
          href={`/business/${business.business_id}`}
          className="flex w-full flex-col p-2"
        >
          <BusinessSearchDisplay business={business} />
        </Link>
      ))}
    </div>
  );
};

const BusinessSearchDisplay = ({ business }: { business: BusinessInfo }) => {
  return (
    <div className="rounded-md bg-zinc-200 p-2" key={business.business_id}>
      <p>{business.business_name}</p>
      <p className="text-xs">{business.phone_number}</p>
      <p className="text-xs">
        {1 + Math.floor(Math.random() * 6)} jobs completed
      </p>
    </div>
  );
};
