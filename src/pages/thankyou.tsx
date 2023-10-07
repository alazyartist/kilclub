import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { api } from "~/utils/api";

const ThankYou = () => {
  const { data: user } = api.user.getUser.useQuery();
  const router = useRouter();
  useEffect(() => {
    if (user?.isBusiness) {
      setTimeout(() => {
        router.push("jobs");
      }, 4000);
    } else {
      router.push("/");
    }
  }, [user, router]);
  return (
    <div className="flex-coll -center">
      <h1 className="text-center text-3xl font-bold">Welcome to the club</h1>
      <p>Thank You for your payment!</p>
      <p className="text-xs">you will be redirected shortly</p>
    </div>
  );
};

export default ThankYou;
