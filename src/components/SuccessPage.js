import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SuccessPage.css";

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleReturnToHome = () => {
    navigate("/"); 
  };

  return (
    <div className="success-container">
      <div className="success-box">
        <h2>🎉 Payment Successful!</h2>
        <p>Thank you for your purchase.</p>
        <button className="home-button" onClick={handleReturnToHome}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
