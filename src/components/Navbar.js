import React from "react";
import { Link } from "react-router-dom"; 
import "../styles/Navbar.css";
import FlightIcon from "../assets/icons/flight icon.svg"; 
import CarRentalGif from "../assets/icons/output-onlinegiftools.gif";
import HotelIcon from "../assets/icons/hotels.svg";
import CompassIcon from "../assets/icons/compass.svg";

class Navbar extends React.Component {
  // Scroll to top and navigate to home function
  handleBrandClick = () => {
    // Scroll to top and navigate to home
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll to top
    });
    // Navigate to the homepage
    window.location.href = '/';
  };

  render() {
    return (
      <nav className="navbar">
        <div className="navbar-brand" onClick={this.handleBrandClick}>
          XploreOn
        </div>

        <div className="navbar-links">
          <a href="#flights" className="nav-link">
            <img src={FlightIcon} alt="Flights" className="nav-icon" />
            Flights
          </a>

          <a href="#car-rentals" className="nav-link">
            <img src={CarRentalGif} alt="Car Rentals" className="nav-icon" />
            Car Rentals
          </a>

          <a href="#hotels" className="nav-link">
            <img src={HotelIcon} alt="Hotels" className="nav-icon" />
            Hotels
          </a>

          <a href="#itinerary" className="nav-link">
            <img src={CompassIcon} alt="Itinerary Generator" className="nav-icon" />
            Itinerary Generator
          </a>
        </div>

        <div className="navbar-actions">
          <Link to="/signin" className="nav-button black-button">
            Login
          </Link>
          <Link to="/signup" className="nav-button white-button">
            Register
          </Link>
        </div>
      </nav>
    );
  }
}

export default Navbar;
