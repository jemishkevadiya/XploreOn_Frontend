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
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.location.href = "/";
  };

  render() {
    const { isLoggedIn, user, isDropdownOpen } = this.state;

    return (
      <nav className="navbar">
        {/* Brand Name */}
        <div className="navbar-brand" onClick={this.handleBrandClick}>
          XploreOn
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/flights" className="nav-link">
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
          </Link>
        </div>

        {/* Login and Register Buttons */}
        <div className="navbar-actions">
          {isLoggedIn ? (
            <div className="profile-container">
              <img
                src={user?.photoURL || DefaultProfile} // Default profile photo
                alt="Profile"
                className="profile-icon"
                onClick={this.toggleDropdown}
              />
              <span className="user-name">
                {user?.displayName || `${user?.firstName || "User"} ${user?.lastName || ""}`}
              </span>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/my-bookings" className="dropdown-item">
                    My Bookings
                  </Link>
                  <button className="dropdown-item logout-button" onClick={this.handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signin" className="nav-button black-button">
                Login
              </Link>
              <Link to="/signup" className="nav-button white-button">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    );
  }
}

export default Navbar;
