import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhooks/(.*)",
    "/api/trpc/business.getBusinesses(.*)",
    "/api/trpc/business.getBusinessWithJobs",
    "/api/trpc/business.findBusinessSearch",
    "/api/trpc/category.getCategories(.*)",
    "/api/trpc/jobs.findReviews",
    "/api/trpc/jobs.makeReview",
    "/search(.*)",
    "/business/(.*)",
    "/testing",
    "/register",
    "/login",
    "/pricing",
    "/review",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
