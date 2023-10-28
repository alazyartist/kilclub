import { Jobs, type BusinessInfo } from "@prisma/client";
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
          className="flex w-full flex-col place-items-center p-2"
        >
          <BusinessSearchDisplay business={business} />
        </Link>
      ))}
    </div>
  );
};

const BusinessSearchDisplay = ({ business }: { business: BusinessInfo }) => {
  const { data: Jobs } = api.business.getJobsforBusiness.useQuery({
    business_id: business.business_id,
  });

  if (!Jobs) { return null; }
  return (
    <div
      className="w-[55rem] max-w-[calc(100vw-1rem)] flex justify-around items-center gap-4 rounded-md bg-zinc-200 py-2 px-4"
      key={business.business_id}
    >
      {/*TODO:  Square Space for Image */}
      <div className="min-h-[4rem] min-w-[4rem] bg-gray-300 rounded-md border-2 border-accent-light">
      </div>

      <div className="flex flex-col w-full">
        <p className="font-bold">{business.business_name}</p>
        <p className="text-xs">{business.phone_number}</p>
      </div>

      <div className="flex flex-col items-center text-xs text-primary-dark">
        <p> {Array.isArray(Jobs) && Jobs?.length} job{Jobs.length !== 1 ? 's' : ''} </p>
        <p> completed </p>
      </div>
    </div>
  );
};
