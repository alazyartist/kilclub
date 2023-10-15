import { SignUp } from "@clerk/nextjs";
import React from "react";

const RegisterPage = () => {
  return (
    <div className="flex h-full w-[100vw] flex-1 flex-col place-content-center place-items-center">
      <SignUp signInUrl="/login" />
    </div>
  );
};

export default RegisterPage;
