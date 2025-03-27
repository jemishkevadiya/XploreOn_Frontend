import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timer = setTimeout(() => {
        navigate("/signin")
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    async function createAccount() {
      if (formData.password !== formData.confirmpassword) {
        setError("Password and Confirm Password do not match!");
        return;
      }

      setIsLoading(true);
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: `${formData.firstname} ${formData.lastname}` });
        await sendEmailVerification(user);

        await axios.post("http://localhost:1111/user/create", {
          uid: user.uid,
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          photoURL: user.photoURL || "",
        });

        localStorage.setItem("user", JSON.stringify({
          uid: user.uid,
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
        }));

        setSuccessMessage("Account created! Verification email sent.");
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError(error.message);
      }
    }

    createAccount();
  };

  const signInWithGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google Sign-In Successful:", user);

      await axios.post("http://localhost:1111/user/create", {
        uid: user.uid,
        firstname: user.displayName.split(" ")[0] || "",
        lastname: user.displayName.split(" ")[1] || "",
        email: user.email,
        photoURL: user.photoURL || "",
      });

      navigate("/");

    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
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
              id="firstname"
              placeholder=" "
              value={formData.firstname}
              onChange={handleChange}
              required
            />
            <label htmlFor="firstname">First Name</label>
            <span className="input-icon">👤</span>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="lastname"
              id="lastname"
              placeholder=" "
              value={formData.lastname}
              onChange={handleChange}
              required
            />
            <label htmlFor="lastname">Last Name</label>
            <span className="input-icon">👤</span>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="email"
              id="emaail"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
            <span className="input-icon">📧</span>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              id="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
            <span className="input-icon">🔑</span>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmpassword"
              id="comfirmpassword"
              placeholder=" "
              value={formData.confirmpassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="confirm password">Confirm password</label>
            <span className="input-icon">🔑</span>
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