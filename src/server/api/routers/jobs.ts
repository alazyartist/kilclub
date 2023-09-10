import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const jobsRouter = createTRPCRouter({
  createJob: protectedProcedure
    .input(
      z.object({
        business_id: z.string(),
        customer_phone_number: z.string(),
        zip_code: z.string(),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newJob = await ctx.prisma.jobs.create({
          data: {
            job_id: createId(),
            business_id: input.business_id,
            customer_phone_number: input.customer_phone_number,
            zip_code: input.zip_code,
            date: input.date,
          },
        });
        return { status: "Job Created", job: newJob };
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create job",
        });
      }
    }),
  getJobs: protectedProcedure
    .input(z.object({ business_id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.auth.userId) {
        const jobs = await ctx.prisma.jobs.findMany({
          where: { business_id: input.business_id },
        });

        return jobs;
      }
    }),
});
