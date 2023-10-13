import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";

const Review = () => {
  const router = useRouter();
  const { pnid: phone_number } = router.query;
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
          <div
            key={review.job_id}
            className=" space-y-4 rounded-md bg-zinc-200 p-2 text-zinc-900"
          >
            {!review.isReviewed && <div>Awaiting Review</div>}
            <div>{review.Business.business_name}</div>
            <div>{review.date.toDateString()}</div>
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-8">
              {Array.isArray(review.media) &&
                review.media.map((img) => {
                  if (typeof img === "string") {
                    return (
                      <div key={img} className="flex flex-col items-center">
                        <Image
                          alt={`job_detail_${img}`}
                          className="aspect-square h-full w-full rounded-md object-cover"
                          src={img}
                          width={1000}
                          height={1000}
                        />
                      </div>
                    );
                  }
                })}
            </div>
            {review.review && (
              <p className={"rounded-md bg-base-light p-2 text-zinc-900"}>
                {review.review}
              </p>
            )}
            {!review.isReviewed && !reviewFormOpen && (
              <button
                onClick={() => setFormOpen(true)}
                className="rounded-md bg-accent-light p-2"
                type="button"
              >
                Add Review
              </button>
            )}
            {reviewFormOpen && (
              <ReviewForm
                phone_number={phone_number}
                job_id={review.job_id}
                business_name={review.Business.business_name}
              />
            )}
          </div>
        ))}
    </div>
  );
};
type ReviewFormData = {
  problem_solved: boolean;
  review: string;
};
const ReviewForm = ({
  business_name,
  job_id,
  phone_number,
}: {
  business_name: string;
  job_id: string;
  phone_number: string;
}) => {
  const { register, handleSubmit } = useForm<ReviewFormData>();
  const [isProblemSolved, setIsProblemSolved] = useState<boolean | null>(null);
  const { mutate: makeReview } = api.jobs.makeReview.useMutation();
  const handleFinalSubmit = (data: ReviewFormData) => {
    makeReview({
      review: data.review,
      job_id: job_id,
      phone_number: phone_number,
      problem_solved: isProblemSolved,
    });
  };
  return (
    <form
      onSubmit={handleSubmit(handleFinalSubmit)}
      className="flex flex-col gap-4 p-2 text-zinc-900"
    >
      <textarea
        className="rounded-md p-2"
        placeholder={`${business_name} was extremely helpful! Would reccomend them again!`}
        {...register("review")}
      />
      <label htmlFor="problem_solved">
        <p className="text-zinc-900">Was your problem solved?</p>
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
      <button
        className="rounded-md bg-accent-light p-2 text-zinc-100"
        disabled={isProblemSolved == null}
      >
        Submit
      </button>
    </form>
  );
};
