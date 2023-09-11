import { jobsRouter } from "~/server/api/routers/jobs";
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { paymentRouter } from "./routers/payment";
import { businessRouter } from "./routers/business";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  jobs: jobsRouter,
  user: userRouter,
  business: businessRouter,
  payments: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
