import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "stream/consumers";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
const stripe = require("stripe")(env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function stripehandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let event;
  const body = await buffer(req);

  try {
    event = stripe.webhooks.constructEvent(
      body.toString(),
      req.headers["stripe-signature"],
      env.STRIPE_WEBHOOK_SECRET,
    );
    console.log(event.type);
    let subscription_id: string;
    let tier: string;
    let customer_id: string;
    let status: string;

    switch (event.type) {
      case "customer.created":
        console.log(event);
        break;
      case "customer.subscription.created":
        //TODO: finish syncronization with database
        subscription_id = event.data.object.id;
        tier = event.data.object.plan.id;
        customer_id = event.data.object.customer;
        status = event.data.object.status;

        break;
      case "customer.subscription.updated":
        //TODO: finish syncronization with database
        subscription_id = event.data.object.id;
        tier = event.data.object.plan.id;
        customer_id = event.data.object.customer;
        status = event.data.object.status;
        await prisma.user.update({
          where: { stripe_customer_id: customer_id },
          data: {
            subscription_id: subscription_id,
            subscription_status: status,
            subscription_tier: tier,
            isBusiness: tier === "founder" ? true : false,
          },
        });

        break;
      case "customer.subscription.deleted":
        subscription_id = event.data.object.id;
        tier = event.data.object.plan.id;
        customer_id = event.data.object.customer;
        status = event.data.object.status;
        //TODO: finish syncronization with database
        await prisma.user.update({
          where: { stripe_customer_id: customer_id },
          data: {
            subscription_id: subscription_id,
            subscription_status: status,
            subscription_tier: tier,
          },
        });
        console.log("deleted", subscription_id, tier, customer_id, status);
        break;
    }
    res.status(200).end();
  } catch (err) {
    console.log(err);
    console.log("Webhook Verification Failed");
    return res.status(400).end();
  }
  //stripe go here
}
