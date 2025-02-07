import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Flight from "./pages/Flight";
import FlightDetails from "./pages/flightdetails";
import CarRentalDetails from "./pages/carrentaldetails";
import { initializeApp } from "firebase/app";
import ForgotPassword from "./pages/ForgotPassword";
import CarRental from "./pages/carRental";
import Hotel from "./pages/Hotel";

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
class App extends React.Component {
  render() {
    return (
    
        <Router>

          <Navbar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path ="/flights" element={<Flight />} />
            <Route path = "/hotels" element={<Hotel />} />
            <Route path="/flightdetails" element={<FlightDetails />} />
            <Route path ="/carrentals" element={<CarRental />}/>
            <Route path ="/carrentaldetails" element={<CarRentalDetails />}/>

          </Routes>
        </Router>
    );
  }
}

export default App;
