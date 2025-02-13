import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PassengerDetails.css";
import { createFlightBooking } from "../services/api";

const PassengerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract state from location (Ensure a default fallback)
  const { adults = 1, children = 0, priceBreakdown = {} } = location.state || {};
  const totalPassengers = adults + children;

  // Initialize passenger details array
  const initialPassengers = Array.from({ length: totalPassengers }, (_, index) => ({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    type: index < adults ? `Adult ${index + 1}` : `Child ${index - adults + 1}`,
  }));

  const [passengerDetails, setPassengerDetails] = useState(initialPassengers);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState("N/A");

  // Set price breakdown correctly
  useEffect(() => {
    if (priceBreakdown?.total) {
      setTotalPrice(`${priceBreakdown.total.currencyCode} ${priceBreakdown.total.units}`);
    }
  }, [priceBreakdown]);

  // Ensure passenger exists before accessing it
  const currentPassenger = passengerDetails[currentPassengerIndex] || {};

  const handleChange = (field, value) => {
    setPassengerDetails((prev) => {
      const updated = [...prev];
      updated[currentPassengerIndex] = { ...updated[currentPassengerIndex], [field]: value };
      return updated;
    });
  };

  // Validation for each passenger
  const validatePassenger = () => {
    const passenger = passengerDetails[currentPassengerIndex];
    const newErrors = {};

    if (!passenger.firstName.trim()) newErrors.firstName = "First Name is required.";
    if (!passenger.lastName.trim()) newErrors.lastName = "Last Name is required.";
    if (!passenger.birthDate) newErrors.birthDate = "Birth Date is required.";
    else {
      const today = new Date().toISOString().split("T")[0];
      if (passenger.birthDate > today) newErrors.birthDate = "Birth Date cannot be in the future.";
    }
    if (!passenger.gender) newErrors.gender = "Gender selection is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Next Passenger or Proceed to Payment
  const handleNextPassenger = async () => {
    if (!validatePassenger()) return;
  
    if (currentPassengerIndex < totalPassengers - 1) {
      setCurrentPassengerIndex(currentPassengerIndex + 1);
    } else {
      // Format passengers array with full details
      const formattedPassengers = passengerDetails.map((passenger, index) => ({
        firstName: passenger.firstName.trim(),
        lastName: passenger.lastName.trim(),
        birthDate: passenger.birthDate,
        gender: passenger.gender,
        type: index < adults ? `Adult ${index + 1}` : `Child ${index - adults + 1}`,
      }));
  
      // Create the flight details object
      const flightDetails = {
        departureCity: location.state.departure,
        destinationCity: location.state.destination,
        departureDate: location.state.departureDate,
        returnDate: location.state.returnDate || null,
        passengers: formattedPassengers, // Now contains actual passenger details
      };
  
      const user = localStorage.getItem("user")
      const userObject = JSON.parse(user); // Convert string to object
      const uid = userObject.uid;
      const payload = {
        "flightDetails": flightDetails,
        "userId": uid,
        "totalAmount": totalPrice
      };
      await createFlightBooking(payload);
    }
  };
  

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  return (
    <div className="passenger-container">
      {/* Left: Passenger Form */}
      <div className="passenger-form">
        <h2>Passenger {currentPassengerIndex + 1} Details</h2>
        <p className="passenger-subtitle">{currentPassenger?.type} Information</p>

        <label>First Name</label>
        <input
          type="text"
          placeholder="Enter first name"
          value={currentPassenger.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          required
        />
        {errors.firstName && <p className="error-text">{errors.firstName}</p>}

        <label>Last Name</label>
        <input
          type="text"
          placeholder="Enter last name"
          value={currentPassenger.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          required
        />
        {errors.lastName && <p className="error-text">{errors.lastName}</p>}

        <label>Birth Date</label>
        <input
          type="date"
          value={currentPassenger.birthDate}
          onChange={(e) => handleChange("birthDate", e.target.value)}
          max={getTodayDate()}
          required
        />
        {errors.birthDate && <p className="error-text">{errors.birthDate}</p>}

        <label>Gender</label>
        <select
          value={currentPassenger.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="error-text">{errors.gender}</p>}
      </div>

      {/* Right: Price Breakdown & Proceed */}
      <div className="price-summary">
        <h2>Price Breakdown</h2>
        <div className="price-item">
          <span>Base Fare:</span> <span>{priceBreakdown?.baseFare?.currencyCode || "CAD"} {priceBreakdown?.baseFare?.units || "N/A"}</span>
        </div>
        <div className="price-item">
          <span>Taxes:</span> <span>{priceBreakdown?.tax?.currencyCode || "CAD"} {priceBreakdown?.tax?.units || "N/A"}</span>
        </div>
        <div className="price-item">
          <span>Fees:</span> <span>{priceBreakdown?.fee?.currencyCode || "CAD"} {priceBreakdown?.fee?.units || "N/A"}</span>
        </div>
        <div className="total-price">
          <span>Total Price:</span> <span>{totalPrice}</span>
        </div>

        {/* Next Passenger / Proceed to Payment */}
        <button className="next-button" onClick={handleNextPassenger}>
          {currentPassengerIndex < totalPassengers - 1 ? "Next Passenger" : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default PassengerDetails;
