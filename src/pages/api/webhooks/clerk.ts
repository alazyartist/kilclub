import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log(req.body);
  if (req.body.type === "user.created" && req.body.data?.id) {
    await prisma.user.create({ data: { user_id: req.body.data.id } });
  }
  res.status(200).end();
}
