import { z } from "zod";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import Stripe from "stripe";

export const paymentRouter = createTRPCRouter({
  getClientSecret: protectedProcedure.query(({ ctx }) => {
    //return stripe PublicKey
    return env.STRIPE_PUBLIC_KEY;
  }),
  createCheckoutSession: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input, ctx }) => {
      return;
    }),
});
