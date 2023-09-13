import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";

const Review = () => {
  const router = useRouter();
  const { pnid: phone_number } = router.query;
  console.log(router.query);
  return (
    <div>
      <h1>{phone_number}</h1>
      {phone_number && <ReviewList phone_number={phone_number} />}
    </div>
  );
};

export default Review;

const ReviewList = ({ phone_number }) => {
  const { data: reviews } = api.jobs.findReviews.useQuery({
    phone_number,
  });
  const [reviewFormOpen, setFormOpen] = useState(false);
  return (
    <div className="space-y-2 p-2">
      {reviews &&
        reviews.map((review) => (
          <div className=" rounded-md bg-accent p-2 text-zinc-100">
            {!review.isCompleted && <div>Job Not Complete</div>}
            <div>{review.Business.business_name}</div>
            <div>{review.date.toDateString()}</div>
            <div className="grid grid-cols-3 gap-2">
              {Array.isArray(review.media) &&
                review.media.map((img) => {
                  if (typeof img === "string") {
                    return (
                      <div key={img} className="flex flex-col items-center">
                        <img
                          alt={`job_detail_${img}`}
                          className="aspect-square h-full w-full rounded-md object-cover"
                          src={img}
                          width={100}
                          height={100}
                        />
                      </div>
                    );
                  }
                })}
            </div>
            {!review.isReviewed && !reviewFormOpen && (
              <button
                onClick={() => setFormOpen(true)}
                className="rounded-md bg-accent-light p-2"
                type="button"
              >
                Add Review
              </button>
            )}
            {reviewFormOpen && <ReviewForm />}
          </div>
        ))}
    </div>
  );
};
type ReviewFormData = {
  problem_solved: boolean;
  review: string;
};
const ReviewForm = () => {
  const { register, handleSubmit } = useForm<ReviewFormData>();
  const [isProblemSolved, setIsProblemSolved] = useState<boolean | null>(null);
  const handleFinalSubmit = (data: ReviewFormData) => {
    console.log({ ...data, isProblemSolved: isProblemSolved });
  };
  return (
    <form
      onSubmit={handleSubmit(handleFinalSubmit)}
      className="flex flex-col gap-4 p-2 text-zinc-900"
    >
      <p>comments</p>
      <textarea
        className="rounded-md p-2"
        placeholder="comments"
        {...register("review")}
      />
      <label htmlFor="problem_solved">
        <p>was your problem solved?</p>
        {/* <select
          id="problem_solved"
          defaultValue="Yes"
          {...register("problem_solved")}
        >
          <option>Yes</option>
          <option>No</option>
        </select> */}
        <div className="flex gap-2">
          {isProblemSolved == null && (
            <div>
              <p>pick one</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsProblemSolved(() => true)}
                  className="rounded-md bg-green-400 p-2"
                  type="button"
                >
                  Yes
                </button>
                <button
                  onClick={() => setIsProblemSolved(() => false)}
                  className="rounded-md bg-red-400 p-2"
                  type="button"
                >
                  No
                </button>
              </div>
            </div>
          )}
          {isProblemSolved != null &&
            (isProblemSolved ? (
              <button
                onClick={() => setIsProblemSolved((prev) => !prev)}
                className="rounded-md bg-green-400 p-2"
                type="button"
              >
                Yes
              </button>
            ) : (
              <button
                onClick={() => setIsProblemSolved((prev) => !prev)}
                className="rounded-md bg-red-400 p-2"
                type="button"
              >
                No
              </button>
            ))}
        </div>
      </label>
      <button>Submit</button>
      <h1>provide feedback in the box above</h1>
    </form>
  );
};
