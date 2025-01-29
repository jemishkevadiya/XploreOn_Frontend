import React, { useState } from "react";
import "../styles/SignUp.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign-Up Data:", formData);

    async function createAccount() {
      if (formData.password !== formData.confirmpassword) {
        setError("Password and Confirm Password do not match!");
        return;
      }

      try {
        await createUserWithEmailAndPassword(
          getAuth(),
         
          formData.email,
          formData.password
        );
        navigate("/");
      } catch (e) {
        setError(e.message);
      }
    }

    createAccount(); // Call the createAccount function
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <h1>WELCOME BACK!</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, rem?</p>
      </div>
      <div className="signup-right">
        <h2>Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
            <span className="input-icon">👤</span>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
            <span className="input-icon">👤</span>
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <span className="input-icon">📧</span>
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
            <span className="input-icon">🔒</span>
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmpassword"
              placeholder="Confirm Password"
              value={formData.confirmpassword}
              onChange={handleChange}
              required
            />
            <span className="input-icon">🔒</span>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/signin">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;