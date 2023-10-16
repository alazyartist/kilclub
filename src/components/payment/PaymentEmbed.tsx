import React, { useState } from "react";
import { type StripeError, loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
const PaymentEmbed = ({ clientSecret }: { clientSecret: string }) => {
  const appearance = {
    theme: "stripe",
    labels: "floating",
    variables: {
      fontWeightNormal: "500",
      colorText: "#202030",
      borderRadius: "10px",

      colorPrimary: "#f4f4f5",
      colorPrimaryText: "#202030",
      colorIconTabSelected: "#fff",
      spacingGridRow: "16px",
    },
    rules: {
      ".Tab, .Input, .Block, .CheckboxInput, .CodeInput": {
        boxShadow: "0px 3px 10px rgba(18, 42, 66, 0.08)",
      },
      ".Block": {
        borderColor: "transparent",
      },
      ".BlockDivider": {
        backgroundColor: "#ebebeb",
      },
      ".Tab, .Tab:hover, .Tab:focus": {
        border: "0",
      },
      ".Tab--selected, .Tab--selected:hover": {
        backgroundColor: "#FD974E",
        color: "#fff",
        border: "2px solid #fff",
      },
    },
  } as const;
  return (
    <>
      {stripePromise && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: clientSecret, appearance: appearance }}
        >
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default PaymentEmbed;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<StripeError>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/thankyou` },
    });
    setError(result.error);
  };
  return (
    <form onSubmit={handleSubmit} className="flex-coll">
      {error && (
        <div className="w-full text-center">
          <p>{error.message}</p>
        </div>
      )}
      <PaymentElement className="mb-4 flex place-content-center " />
      <button
        className="rounded-md bg-accent-light p-2 text-zinc-100"
        type="submit"
        disabled={!stripe}
      >
        Pay
      </button>
    </form>
  );
};
