import { TRPCError } from "@trpc/server";
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
      const customer_id = await findOrCreateCustomer(input);
      if (customer_id) {
        const subscription = await stripe.subscriptions.create({
          customer: customer_id,
          items: [
            {
              price: "founder",
            },
          ],
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription" },
          expand: ["latest_invoice.payment_intent"],
        });
        if (subscription) {
          return {
            sub_id: subscription.id,
            clientSecret:
              subscription.latest_invoice.payment_intent.client_secret,
          };
        }
      }
    }),
  createCheckoutSession: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input, ctx }) => {
      return;
    }),
});

const findOrCreateCustomer = async (input: { email: string; name: string }) => {
  const existingCustomer = await stripe.customers.list({
    email: input.email,
  });
  if (existingCustomer?.data.length > 0) {
    const customer_id = existingCustomer.data[0].id;
    return customer_id;
  } else {
    try {
      const newCustomer = await stripe.customers.create({
        email: input.email,
        name: input.name,
      });
      const new_customer_id = newCustomer.id;
      return new_customer_id;
    } catch (err) {
      console.log("FAILED_TO_CREATE_STRIPE_CUSTOMER");
    }
  }
};
