import { BusinessInfo } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

const Search = () => {
  const router = useRouter();
  const { sq: query } = router.query;
  return (
    <div className="flex w-full flex-col">
      <p className="w-full bg-accent p-4 text-center text-lg text-zinc-100">
        Here's what we found
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
    return <div>No results for {query}</div>;
  }

  return (
    <div>
      {data.map((business) => (
        <Link
          href={`/business/${business.business_id}`}
          className="flex w-full flex-col"
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
    </div>
  );
};
