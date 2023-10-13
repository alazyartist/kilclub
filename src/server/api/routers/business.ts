import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const businessRouter = createTRPCRouter({
  getBusinessWithJobs: publicProcedure
    .input(z.object({ business_id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const business = await ctx.prisma.businessInfo.findUnique({
          where: { business_id: input.business_id },
          include: {
            Jobs: {
              orderBy: { date: "desc" },
              include: { Categories: { include: { Category: true } } },
            },
            Categories: { include: { Category: true } },
          },
        });
        return business;
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
      const user = await ctx.prisma.user.findUnique({
        where: { user_id: ctx.auth.userId },
      });
      const businesses = await ctx.prisma.businessInfo.findUnique({
        where: { business_id: user.business_id },
        include: {
          Jobs: {
            orderBy: { date: "desc" },

            include: { Categories: { include: { Category: true } } },
          },
          Categories: { include: { Category: true } },
        },
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
      const catresults = await ctx.prisma.category.findMany({
        include: { BusinessesCategories: { include: { Business: true } } },
      });
      const busResults = catresults
        .filter((c) => c.name.toLowerCase().includes(input.query))
        .flatMap((c) => c.BusinessesCategories.map((bc) => bc.Business));
      return [...results, ...busResults];
    }),
  saveBusinessCategories: protectedProcedure
    .input(
      z.object({
        business_id: z.string(),
        categories: z.array(
          z.object({
            category_id: z.string(),
            name: z.string(),
            type: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);

      try {
        await ctx.prisma.businessCategories.deleteMany({
          where: { business_id: input.business_id },
        });

        const savedCats = Promise.all(
          input.categories.map(async (category) => {
            const savedCat = ctx.prisma.businessCategories.create({
              data: {
                business_id: input.business_id,
                category_id: category.category_id,
              },
            });
            return savedCat;
          }),
        );

        return savedCats;
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "FAILED_TO_SAVE_CATEGORIES",
        });
      }
    }),
});
