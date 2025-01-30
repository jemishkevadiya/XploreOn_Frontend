import React, { useState, useEffect } from "react";
import "../styles/SignUp.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const googleicon = "/images/googleicon.svg";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(10); // Countdown timer
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timer = setTimeout(() => {
        navigate("/signin"); // Redirect after 10 seconds
      }, 10000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [successMessage, navigate]);

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
  
      setIsLoading(true); // Start loading
  
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
  
        // Use the updateProfile function to set the displayName
        await updateProfile(user, {
          displayName: `${formData.firstname} ${formData.lastname}`,
        });
  
        // Send email verification
        await sendEmailVerification(user);
  
        setSuccessMessage(
          "A verification email has been sent. Redirecting to Sign In in 10 seconds..."
        );
        setIsLoading(false); // Stop loading
      } catch (e) {
        setIsLoading(false); // Stop loading
        setError(e.message);
      }
    }
  
    createAccount();
  };

   

  // Sign In with Google
  const signInWithGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google Sign-In Successful:", user);
      navigate("/"); // Redirect to homepage
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <h1>WELCOME BACK!</h1>
        <p>
          Join us today to unlock personalized travel itineraries, exclusive
          deals, and a seamless booking experience. Your next adventure starts
          here!
        </p>
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
          {successMessage && (
            <p className="success-message">
              {successMessage} Redirecting in <strong>{countdown}</strong>{" "}
              seconds...
            </p>
          )}
          {isLoading && (
            <p className="loading-message">Waiting for email verification...</p>
          )}
          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Google Sign-In Button */}
        <div className="social-signin">
          <button className="google-signin" onClick={signInWithGoogle}>
            <img
              src={googleicon}
              alt="Google Logo"
            />
            Sign Up with Google
          </button>
        </div>

        <p className="login-link">
          Already have an account? <a href="/signin">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
