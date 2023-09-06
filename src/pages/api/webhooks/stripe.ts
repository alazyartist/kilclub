import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

type ResponseData = {};

export default async function stripehandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log(req.body);
  //stripe go here
  res.status(200).end();
}
