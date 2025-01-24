import React, { useState } from "react";
import "../styles/SignUp.css"; 


const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign-Up Data:", formData); 
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
              name="username"
              placeholder="Username"
              value={formData.username}
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
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/signin">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
