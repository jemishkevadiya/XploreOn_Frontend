import React, { useState } from "react";
import axios from "axios";
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
  const [showResend, setShowResend] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logIn(); 
  };

  async function logIn() {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
  
      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        setShowResend(true);
        await auth.signOut(); 
        return;
      }
  
      const response = await axios.get(`http://localhost:1111/api/user/profile/${user.uid}`);
  
      if (response.data) {
        console.log("User Data from MongoDB:", response.data);
  
        localStorage.setItem("user", JSON.stringify(response.data));
  
        navigate("/");
      } else {
        setError("User not found in database.");
      }
    } catch (e) {
      setError(e.message);
    }
  }
  async function resendVerificationEmail() {
    try {
      setError("");
      setSuccessMessage("");
  
      const auth = getAuth();
  
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
  
      if (user.emailVerified) {
        setSuccessMessage("Your email is already verified. Please log in.");
        return;
      }
  
      await sendEmailVerification(user);
      setSuccessMessage("A new verification email has been sent. Please check your inbox.");
  
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
    id="email"   // Add this id to link the label to the input
    placeholder=" "  // Trigger the floating label behavior
    value={formData.email}
    onChange={handleChange}
    required
  />
  <label htmlFor="email">Email</label>
</div>

<div className="form-group">
  <input
    type="password"
    name="password"
    id="password"  // Add this id to link the label to the input
    placeholder=" "  // Trigger the floating label behavior
    value={formData.password}
    onChange={handleChange}
    required
  />
  <label htmlFor="password">Password</label>
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
