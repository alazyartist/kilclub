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
    res.status(200).end();
  } catch (err) {
    console.log(err);
    console.log("Webhook Verification Failed");
    return res.status(400).end();
  }
  //stripe go here
}
