import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "stream/consumers";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
type ResponseData = {};
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
    switch (event.type) {
      case "customer.created":
        console.log(event);
        break;
      case "customer.subscription.created":
        //TODO: finish syncronization with database
        console.log(event.data.object.id);
        console.log(event.data.object.plan);
        //id
        //customer
        //status
        break;
      case "customer.subscription.updated":
        //TODO: finish syncronization with database
        const subscription_id = event.data.object.id;
        const tier = event.data.object.plan.id;
        const customer_id = event.data.object.customer;
        const status = event.data.object.status;
        console.log(subscription_id, tier, customer_id, status);
        break;
      case "customer.subscription.deleted":
        //TODO: finish syncronization with database
        console.log(event);
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
