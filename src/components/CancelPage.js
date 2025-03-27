import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CancelPage.css";

const CancelPage = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/"); 
  };

  return (
    <div className="cancel-container">
      <div className="cancel-box">
        <h2> Payment Canceled</h2>
        <p>Your payment was not completed. If this was a mistake, please try again.</p>
        <button className="retry-button" onClick={handleRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default CancelPage;
