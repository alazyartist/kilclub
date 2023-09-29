import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const businessRouter = createTRPCRouter({
  getBusinessWithJobs: publicProcedure.input(z.object({ business_id: z.string() })).query(async ({ ctx, input }) => {
    try {
      const businesses = await ctx.prisma.businessInfo.findUnique({
        where: { business_id: input.business_id }, include: { Jobs: true }
      });
      return businesses;
    } catch (err) {
      console.log(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "FAILED_TO_FIND_BUSINESSES",
      });
    }
  }),
  getMyBusiness: publicProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.prisma.user.findUnique({ where: { user_id: ctx.auth.userId }})
      const businesses = await ctx.prisma.businessInfo.findUnique({
        where: { business_id: user.business_id }, include: { Jobs: true }
      });
      return businesses;
    } catch (err) {
      console.log(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "FAILED_TO_FIND_BUSINESSES",
      });
    }
  }),
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
  findBusinessSearch: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.prisma.businessInfo.findMany({
        where: { zip_code: { contains: input.query } },
      });
      return results;
    }),
});
