import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
type ResponseData = {};
const stripe = require("stripe")(env.STRIPE_SECRET_KEY);

export default async function stripehandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log(req.body);
  //stripe go here
  res.status(200).end();
}
