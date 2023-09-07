import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string);
const PaymentEmbed = ({ clientSecret }: { clientSecret: string }) => {
  return (
    <>
      {stripePromise && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: clientSecret }}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/thankYou` },
    });
  };
  return (
    <form onSubmit={handleSubmit} className="flex-coll">
      <PaymentElement />
      <button
        className="rounded-md bg-accent-light p-2"
        type="submit"
        disabled={!stripe}
      >
        Join
      </button>
    </form>
  );
};
