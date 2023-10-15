import { SignIn } from "@clerk/nextjs";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex h-full w-[100vw] flex-1 flex-col place-content-center place-items-center">
      <SignIn signUpUrl="/register" />
    </div>
  );
};

export default LoginPage;
