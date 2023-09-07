import { z } from "zod";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
const stripe = require("stripe")(env.STRIPE_SECRET_KEY);
export const paymentRouter = createTRPCRouter({
  getClientSecret: protectedProcedure.query(({ ctx }) => {
    //return stripe PublicKey
    return env.STRIPE_PUBLIC_KEY;
  }),
  createCustomer: protectedProcedure
    .input(z.object({ email: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingCustomer = await stripe.customers.list({
        email: input.email,
      });
      if (existingCustomer?.data.length > 0) {
        const customer_id = existingCustomer.data[0].id;
        return customer_id;
      } else {
        console.log("need to make");
      }
      // const customer = await stripe.customers.create({
      //   email: input.email,
      //   name: input.name,
      // });
      console.log(existingCustomer);
      return existingCustomer;
    }),
  createCheckoutSession: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input, ctx }) => {
      return;
    }),
});
