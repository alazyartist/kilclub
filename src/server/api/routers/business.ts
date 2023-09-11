import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const businessRouter = createTRPCRouter({
  getBusinesses: publicProcedure.query(async ({ ctx }) => {
    try {
      const businesses = await ctx.prisma.businessInfo.findMany();

      return businesses;
    } catch (err) {
      console.log(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "FAILED_TO_FIND_BUSINESSES",
      });
    }
  }),
});