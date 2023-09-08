import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
const stripe: Stripe = require("stripe")(env.STRIPE_SECRET_KEY);
export const paymentRouter = createTRPCRouter({
  getClientSecret: protectedProcedure.query(({ ctx }) => {
    //return stripe PublicKey
    return env.STRIPE_PUBLIC_KEY;
  }),
  createCustomerSubscription: protectedProcedure
    .input(z.object({ email: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.auth.userId;
      if (!user_id) return;
      const customer_id = await findOrCreateCustomer(
        input,
        user_id,
        ctx.prisma,
      );
      if (customer_id) {
        const subscription = await findOrCreateSubscription(
          customer_id,
          user_id,
          ctx.prisma,
        );
        if (subscription) {
          return {
            sub_id: subscription.id,
            clientSecret: subscription.client_secret,
          };
        }
      }
    }),
});

const findOrCreateCustomer = async (
  input: { email: string; name: string },
  user_id: string,
  prisma: PrismaClient,
) => {
  const existingCustomer = await stripe.customers.list({
    email: input.email,
  });
  if (existingCustomer.data.length > 0) {
    //@ts-ignore
    const customer_id = existingCustomer.data[0].id;
    return customer_id;
  } else {
    try {
      const newCustomer = await stripe.customers.create({
        email: input.email,
        name: input.name,
      });
      const new_customer_id = newCustomer.id;
      await prisma.user.update({
        where: { user_id: user_id },
        data: { stripe_customer_id: new_customer_id },
      });

      return new_customer_id;
    } catch (err) {
      console.log("FAILED_TO_CREATE_STRIPE_CUSTOMER");
    }
  }
};

//TODO: finish syncronization with database for findOrCreateSubscription

const findOrCreateSubscription = async (
  customer_id: string,
  user_id: string,
  prisma: PrismaClient,
) => {
  const customer = await stripe.customers.retrieve(customer_id, {
    expand: ["subscriptions"],
  });
  //@ts-ignore
  const subscriptions = customer.subscriptions.data;
  if (subscriptions.length > 0) {
    const latestSubscription = subscriptions[subscriptions.length - 1];
    const latestInvoice = await stripe.invoices.retrieve(
      latestSubscription.latest_invoice,
      { expand: ["payment_intent"] },
    );
    let client_secret;
    if (latestInvoice) {
      //@ts-ignore
      client_secret = latestInvoice.payment_intent.client_secret;
    }
    return { id: latestSubscription.id, client_secret: client_secret };
  } else {
    try {
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
        await prisma.user.update({
          where: { user_id: user_id },
          data: {
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_tier: "founder",
            isBusiness: true,
          },
        });
      }

      return {
        id: subscription.id,
        //@ts-ignore
        client_secret: subscription.latest_invoice.payment_intent.client_secret,
      };
    } catch (err) {
      console.log("FAILED_TO_CREATE_SUBSCRIPTION");
    }
  }
};
