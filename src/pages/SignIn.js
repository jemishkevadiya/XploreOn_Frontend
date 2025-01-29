import React, { useState } from "react";
import "../styles/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
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
      await signInWithEmailAndPassword(getAuth(), formData.email, formData.password);
      navigate("/"); // Redirect to the articles page
    } catch (e) {
      setError(e.message); // Set error message
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
          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup">Register</Link>
          </p>
          <p>
             <Link to="/signup">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;