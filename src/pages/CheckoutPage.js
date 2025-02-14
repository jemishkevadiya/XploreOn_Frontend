import React, { useState, useEffect } from "react";
import CheckoutForm from "../components/CheckoutForm";
import "../styles/CheckoutPage.css";

const CheckoutPage = ({ user, selectedService }) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  // Define service data
  const serviceData = {
    flight: {
      name: "Flight Booking",
      price: 50000, // $500.00 in cents
    },
    hotel: {
      name: "Hotel Stay",
      price: 15000, // $150.00 in cents
    },
    carRental: {
      name: "Car Rental",
      price: 20000, // $200.00 in cents
    },
  };

  // Get selected service details (based on user selection)
  const service = serviceData[selectedService] || serviceData.flight; // Default to flight if nothing selected

  // Handle quantity change and ensure it's a positive integer
  const handleQuantityChange = (event) => {
    const value = Math.max(1, parseInt(event.target.value) || 1); // Ensure quantity is >= 1
    setQuantity(value);
  };

  const mockItems = [
    {
      price_data: {
        currency: "cad",
        product_data: { name: service.name },
        unit_amount: service.price, // Dynamic price from selected service
      },
      quantity: quantity, // Dynamic quantity based on user input
    },
  ];

  // Ensure user is provided and has an email
  useEffect(() => {
    if (!user) {
      setError("User is required to proceed with checkout.");
    } else if (!user.email) {
      setError("Email is required for checkout.");
    }
  }, [user]);

  // If there's an error, display it and prevent checkout
  if (error) {
    return (
      <div className="checkout-container">
        <div className="checkout-box">
          <h2>⚠️ Checkout Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Check if user.email is available before rendering the form
  if (!user || !user.email) {
    return (
      <div className="checkout-container">
        <div className="checkout-box">
          <h2>⚠️ Missing User Email</h2>
          <p>Please log in to continue with the checkout.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <h2>Checkout for {service.name}</h2>

        {/* Display quantity selector */}
        <div className="quantity-selector">
          <label htmlFor="quantity">Quantity: </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max="10"
            step="1"
          />
        </div>

        {/* Pass dynamic data to CheckoutForm */}
        <CheckoutForm
          items={mockItems}
          service={service.name}
          email={user.email}
          userId={user.id}
          bookingId={user.bookingId || ""}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
