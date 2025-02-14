import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Hotel from "./pages/Hotel";
import Flight from "./pages/Flight";
import Car from "./pages/Car";
import ForgotPassword from "./pages/ForgotPassword";
import UserProfilePage from "./pages/UserProfilePage";  // Import Profile Page
import ProtectedRoute from "./components/ProtectedRoute"; // Import Protected Route

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINSENDERID,
  appId: process.env.REACT_APP_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      {/* Pass user state to Navbar */}
      <Navbar user={user} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/hotels" element={<Hotel />} />
        <Route path="/flights" element={<Flight />} />
        <Route path="/car-rentals" element={<Car />} />
        
        {/* Protected Profile Page Route */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute user={user}>
              <UserProfilePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
