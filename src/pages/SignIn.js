import React, { useState } from "react";
import "../styles/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResend, setShowResend] = useState(false); // Show "Resend Email" button
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logIn(); // Call the logIn function
  };

  async function logIn() {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // ❌ Block access if email is not verified
      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        setShowResend(true); // Show the resend verification button
        await auth.signOut(); // Force logout to prevent unauthorized access
        return;
      }

      // ✅ Allow login if verified
      navigate("/"); // Redirect to homepage
    } catch (e) {
      setError(e.message); // Display error message
    }
  }
  async function resendVerificationEmail() {
    try {
      setError("");
      setSuccessMessage("");
  
      const auth = getAuth();
  
      // ✅ Re-authenticate user temporarily
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
  
      // ❌ Block resend if email is already verified
      if (user.emailVerified) {
        setSuccessMessage("Your email is already verified. Please log in.");
        return;
      }
  
      // ✅ Send verification email
      await sendEmailVerification(user);
      setSuccessMessage("A new verification email has been sent. Please check your inbox.");
  
      // ❌ Log the user out after sending the email
      await auth.signOut();
  
    } catch (e) {
      setError(e.message);
    }
  }
  

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>Welcome Back!</h1>
        <p>Sign in to continue accessing personalized itineraries and services.</p>
      </div>
      <div className="auth-right">
        <h2>Sign In</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        {showResend && (
          <button onClick={resendVerificationEmail} className="auth-button resend-button">
            Resend Verification Email
          </button>
        )}

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup">Register</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
