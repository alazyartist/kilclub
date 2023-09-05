import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  upgrade: protectedProcedure.query(({ ctx }) => {
    return ctx.auth.userId;
  }),
});
