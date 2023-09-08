import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({
  getStripeCustomer: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.auth.userId) {
      const user = await prisma.user.findUnique({
        where: { user_id: ctx.auth.userId },
      });

      return user?.stripe_customer_id;
    }
  }),
});
