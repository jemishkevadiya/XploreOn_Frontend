import React, { useState } from "react";
import "../styles/SignIn.css";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("A password reset link has been sent to your email.");
      setTimeout(() => navigate("/signin"), 5000); 
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>Reset Your Password</h1>
        <p>Enter your email to receive a password reset link.</p>
      </div>
      <div className="auth-right">
        <h2>Forgot Password</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
  <input
    type="email"
    id="email"   
    placeholder=" " 
    value={email}
    onChange={handleChange}
    required
  />
  <label htmlFor="email">Enter your email</label>
</div>

          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <button type="submit" className="auth-button">
            Send Reset Link
          </button>
        </form>
        <p>
          <a href="/signin">Back to Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
