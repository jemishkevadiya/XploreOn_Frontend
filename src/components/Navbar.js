import React from "react";
import "../styles/Navbar.css";
import { Link } from "react-router-dom"; 


const FlightIcon = "/images/flight.svg"; 
const CarRentalGif = "/images/icons8-car.svg";
const HotelIcon ="/images/hotels.svg"
const CompassIcon ="/images/compass.svg"
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
          <Link to="/flights" className="nav-link">
            <img src={FlightIcon} alt="Flights" className="nav-icon" />
            Flights
          </Link>
          <Link to="/car-rentals" className="nav-link">
            <img src={CarRentalGif} alt="Car Rentals" className="nav-icon" />
            Car Rentals
          </Link>
          <Link to="/hotels" className="nav-link">
            <img src={HotelIcon} alt="Hotels" className="nav-icon" />
            Hotels
          </Link>
          <Link to="/itinerary" className="nav-link">
            <img src={CompassIcon} alt="Itinerary Generator" className="nav-icon" />
            Itinerary Generator
          </Link>
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