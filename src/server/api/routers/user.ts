import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
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
  getUser: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.auth.userId) {
      const user = await prisma.user.findUnique({
        where: { user_id: ctx.auth.userId },
      });

      return user;
    }
  }),
  getBusiness: protectedProcedure
    .input(z.object({ business_id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.auth.userId) {
        const businessInfo = await prisma.businessInfo.findUnique({
          where: { business_id: input.business_id },
        });

        return businessInfo;
      }
    }),
  createBusiness: protectedProcedure
    .input(
      z.object({
        business_name: z.string(),
        phone_number: z.string(),
        zip_code: z.string(),
        website: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.auth.userId) {
        const user = await prisma.user.findUnique({
          where: { user_id: ctx.auth.userId },
        });
        if (!user?.isBusiness) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        try {
          console.log("input", input);
          console.log(createId());
          const newBusiness = await prisma.businessInfo.create({
            data: {
              business_id: createId(),
              business_name: input.business_name,
              phone_number: input.phone_number,
              zip_code: input.zip_code,
            },
          });
          console.log("newBusiness", newBusiness);
          if (newBusiness) {
            await prisma.user.update({
              where: { user_id: ctx.auth.userId },
              data: { business_id: newBusiness.business_id },
            });
          } else {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create business",
            });
          }
          return newBusiness;
        } catch (err) {
          console.log(err);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }
    }),
});
