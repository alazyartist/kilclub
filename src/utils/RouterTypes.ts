import type { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type GetCategories = RouterOutput["category"]["getCategories"];
export type GetMyBusiness = RouterOutput["business"]["getMyBusiness"];
export type GetBusinessWithJobs =
  RouterOutput["business"]["getBusinessWithJobs"];
