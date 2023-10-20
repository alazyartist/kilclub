import { type PrismaClient } from "@prisma/client";
import type Stripe from "stripe";
import { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
const stripe: Stripe = require("stripe")(env.STRIPE_SECRET_KEY);
export const paymentRouter = createTRPCRouter({
  getClientSecret: protectedProcedure.query(({}) => {
    //return stripe PublicKey
    return env.STRIPE_PUBLIC_KEY;
  }),
  createBillingPortal: protectedProcedure
    .input(z.object({ stripe_customer_id: z.string() }))
    .mutation(async ({ input }) => {
      const session = await stripe.billingPortal.sessions.create({
        customer: input.stripe_customer_id,
        return_url: "http://localhost:3000/account",
      });

      return session.url;
    }),
  createCustomerSubscription: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        price_id: z.union([
          z.literal("founder"),
          z.literal("local"),
          z.literal("premium"),
        ]),
      }),
    )
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
          input.price_id,
        );
        if (subscription) {
          return {
            sub_id: subscription.id,
            clientSecret: subscription.client_secret,
            paid: subscription.paid,
          };
        }
      }
    }),
});
const price_id = "founder" || "premium" || ("local" as const);
const findOrCreateCustomer = async (
  input: { email?: string; name?: string; price_id?: typeof price_id },
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

const findOrCreateSubscription = async (
  customer_id: string,
  user_id: string,
  prisma: PrismaClient,
  price_id: string,
) => {
  const customer = await stripe.customers.retrieve(customer_id, {
    expand: ["subscriptions"],
  });
  //@ts-ignore
  const subscriptions = customer.subscriptions.data;
  if (subscriptions.length > 0) {
    const latestSubscription = subscriptions[subscriptions.length - 1];
    if (latestSubscription.plan.id !== price_id) {
      try {
        const subscription = await stripe.subscriptions.create({
          customer: customer_id,
          items: [
            {
              price: price_id,
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
              subscription_tier: price_id,
              isBusiness: price_id !== "local" ? true : false,
            },
          });
          console.log(subscription.latest_invoice);
          return {
            id: subscription.id,
            client_secret:
              //@ts-ignore
              subscription.latest_invoice.payment_intent.client_secret,
            //@ts-ignore
            paid: subscription.latest_invoice.paid,
          };
        }
      } catch (err) {
        console.log(err);
        console.log("FAILED_TO_CREATE_SUBSCRIPTION");
      }
    }

    const latestInvoice = await stripe.invoices.retrieve(
      latestSubscription.latest_invoice,
      { expand: ["payment_intent"] },
    );
    let client_secret: string;
    if (latestInvoice) {
      //@ts-ignore
      client_secret = latestInvoice.payment_intent.client_secret;
    }
    return {
      id: latestSubscription.id,
      client_secret: client_secret,
      paid: latestInvoice.paid,
    };
  } else {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customer_id,
        items: [
          {
            price: price_id,
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
            subscription_tier: price_id,
            isBusiness: price_id !== "local" ? true : false,
          },
        });
        console.log(subscription.latest_invoice);
        return {
          id: subscription.id,
          client_secret:
            //@ts-ignore
            subscription.latest_invoice.payment_intent.client_secret,
          //@ts-ignore
          paid: subscription.latest_invoice.paid,
        };
      }
    } catch (err) {
      console.log(err);
      console.log("FAILED_TO_CREATE_SUBSCRIPTION");
    }
  }
};
