import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Flight from "./pages/Flight";
import FlightDetails from "./pages/flightdetails";
import CarRental from "./pages/carRental";
import CarRentalDetails from "./pages/carrentaldetails";
import Hotel from "./pages/Hotel";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import ForgotPassword from "./pages/ForgotPassword";
import UserProfilePage from "./pages/UserProfilePage";  // Import Profile Page
import ProtectedRoute from "./components/ProtectedRoute"; // Import Protected Route
import PaymentHistory from "./pages/PaymentHistory";
// Firebase Configuration
import HotelDetail from "./pages/HotelDetails";
import HotelDetailView from "./pages/HotelDetailView";

import Itinerary from "./pages/Itinerary"; 
import ItineraryResults from "./pages/ItineraryResults"
import PassengerDetails from "./pages/PassengerDetails";
import SuccessPage from "./components/SuccessPage";
import CancelPage from "./components/CancelPage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINSENDERID,
  appId: process.env.REACT_APP_APPID
};

const app = initializeApp(firebaseConfig);

class App extends React.Component {
  render() {
    return (
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
          
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/my-bookings" element={<Bookings/>}/>
            <Route path="payments" element={<PaymentHistory/>}/>
            <Route path="/userProfile" element={<UserProfilePage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path ="/flights" element={<Flight />} />
            <Route path ="/flightsDetails" element={<FlightDetails/>} />
            <Route path = "/hotels" element={<Hotel />} />
            <Route path ="/carrentals" element={<CarRental />}/>
            <Route path ="/carrentaldetails" element={<CarRentalDetails />}/>
            <Route path ="/passenger-details" element={<PassengerDetails />} />
            <Route path ="/success" element={<SuccessPage />} />
            <Route path ="/cancel" element={<CancelPage />} />
            <Route path ="/hoteldetails" element={<HotelDetail />}/>
            <Route path ="/hotel/:hotelId" element={<HotelDetailView />} />
            <Route path ="/itinerary" element={<Itinerary />} /> 
            <Route path ="/itinerary/results" element={<ItineraryResults />} />
          </Routes>
        </Router>
    );
  }
}

export default App;