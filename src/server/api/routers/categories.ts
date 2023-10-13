import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { createId } from "@paralleldrive/cuid2";

export const categoryRouter = createTRPCRouter({
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      include: {
        Children: { include: { Child: true } },
        Parents: { include: { Parent: true } },
      },
    });
    return categories;
  }),
  getBusinessCategories: protectedProcedure.query(async ({ ctx }) => {
    const business = await ctx.prisma.user.findUnique({
      where: { user_id: ctx.auth.userId },
    });
    const categories = await ctx.prisma.businessCategories.findMany({
      where: { business_id: business.business_id },
      include: {
        Category: true,
      },
    });
    return categories;
  }),
  addCategory: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        parent_id: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type === "sub") {
        try {
          const addedCategory = await ctx.prisma.category.create({
            data: {
              category_id: createId(),
              name: input.name,
              type: input.type,
            },
          });
          const connected = await ctx.prisma.childCategories.create({
            data: {
              child_id: addedCategory.category_id,
              parent_id: input.parent_id,
            },
          });

          return { addedCategory, connected };
        } catch (err) {
          console.log(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "FAILED_TO_CREATE_CATEGORY_WITH_PARENT",
          });
        }
      }
      if (input.type === "base") {
        try {
          const addedCategory = await ctx.prisma.category.create({
            data: {
              category_id: createId(),
              name: input.name,
              type: input.type,
            },
          });
          return addedCategory;
        } catch (err) {
          console.log(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "FAILED_TO_CREATE_CATEGORY",
          });
        }
      }
    }),
});
