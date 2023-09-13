import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { S3 } from "aws-sdk";
import { env } from "~/env.mjs";
import { type JsonArray } from "@prisma/client/runtime/library";
const s3: S3 = new S3({
  region: env.AWS_REGION,
});
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
          orderBy: { date: "desc" },
        });

        return jobs;
      }
    }),
  deleteJob: protectedProcedure
    .input(z.object({ job_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.jobs.delete({ where: { job_id: input.job_id } });
        return;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Job Not Deleted",
        });
      }
    }),
  uploadMedia: protectedProcedure
    .input(
      z.object({
        filenames: z.array(
          z.string().transform((arg) => arg.replace(/\s|\,|\-/g, "")),
        ),
        job_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input.filenames);
      try {
        const bucketName = "keep-it-local-club";
        const objectKeys = input.filenames.map(
          (filename) => `${ctx.auth.userId}/${input.job_id}/${filename}`,
        );

        const s3ObjectUrls = objectKeys.map(
          (objectKey) =>
            `https://keep-it-local-club.s3.amazonaws.com/${objectKey}`,
        );
        const oldJobMedia = await ctx.prisma.jobs.findUnique({
          where: { job_id: input.job_id },
        });
        if (oldJobMedia?.media) {
          const mediaSet = new Set([
            ...(oldJobMedia?.media as JsonArray),
            ...s3ObjectUrls,
          ]);
          const mediaArray = Array.from(mediaSet);
          const jobMedia = await ctx.prisma.jobs.update({
            where: { job_id: input.job_id },
            data: {
              media: mediaArray,
            },
          });
          console.log(jobMedia);
        } else {
          const jobMedia = await ctx.prisma.jobs.update({
            where: { job_id: input.job_id },
            data: { media: [...s3ObjectUrls] },
          });
          console.log(jobMedia);
        }
        const uploadUrls = objectKeys.map((objectKey) =>
          s3.getSignedUrl("putObject", {
            Bucket: bucketName,
            Key: objectKey,
            Expires: 3600,
          }),
        );
        console.log(uploadUrls);
        return uploadUrls;
      } catch (err) {
        console.log(err);
      }
    }),
  deleteMedia: protectedProcedure
    .input(
      z.object({
        job_id: z.string(),
        objectKey: z
          .string()
          .transform((arg) =>
            arg.replace("https://keep-it-local-club.s3.amazonaws.com/", ""),
          ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("deleting", input.objectKey);
      const bucketName = "keep-it-local-club";
      try {
        const job = await ctx.prisma.jobs.findUnique({
          where: { job_id: input.job_id },
        });
        if (!job)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Job Not Found",
          });
        if (job.media && Array.isArray(job.media)) {
          await ctx.prisma.jobs.update({
            where: { job_id: input.job_id },
            data: {
              //@ts-ignore
              media: job.media.filter((img) => !img.includes(input.objectKey)),
            },
          });
        }

        await s3
          .deleteObject({ Bucket: bucketName, Key: input.objectKey })
          .promise();
        return;
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "FAILED_TO_DELETE_MEDIA",
        });
      }
    }),
  findReviews: publicProcedure
    .input(z.object({ phone_number: z.string() }))
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.jobs.findMany({
        where: { customer_phone_number: input.phone_number },
        include: { Business: true },
      });

      return reviews;
    }),
  makeReview: publicProcedure
    .input(
      z.object({
        job_id: z.string(),
        phone_number: z.string(),
        review: z.string(),
        problem_solved: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //setup review verification later
      try {
        const review = await ctx.prisma.jobs.update({
          where: { job_id: input.job_id },
          data: {
            review: input.review,
            problem_solved: input.problem_solved,
            isReviewed: true,
          },
        });
        return review;
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "FAILED_TO_MAKE_REVIEW",
        });
      }
    }),
  markComplete: protectedProcedure
    .input(z.object({ job_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.jobs.update({
          where: { job_id: input.job_id },
          data: { isCompleted: true },
        });
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "FAILE_TO_MARK_COMPLETE",
        });
      }
    }),
});
