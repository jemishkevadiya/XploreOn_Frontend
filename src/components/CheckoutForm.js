import React, { useState } from "react";
import { createCheckoutSession } from "../services/stripeService";

const CheckoutForm = ({ items, service, email, userId, bookingId }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!email || !userId || !bookingId) {
      alert("Missing required information: email, user ID, or booking ID.");
      console.error(" Missing required fields:", { email, userId, bookingId });
      return;
    }

    setLoading(true);
    try {
      const checkoutUrl = await createCheckoutSession(items, service, email, userId, bookingId);
      window.location.href = checkoutUrl; // Redirect to Stripe Checkout
    } catch (error) {
      console.error(" Checkout failed:", error);
      alert("Error creating checkout session!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? "Processing..." : "Checkout with Stripe"}
    </button>
  );
};

export default CheckoutForm;
