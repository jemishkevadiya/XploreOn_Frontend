import React from "react";
import "../styles/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar">
        {/* Brand Name */}
        <div className="navbar-brand">XploreOn</div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <a href="#flights" className="nav-link">
            Flights
          </a>
          <a href="#car-rentals" className="nav-link">
            Car Rentals
          </a>
          <a href="#hotels" className="nav-link">
            Hotels
          </a>
        </div>

        {/* Profile Icon */}
        <div className="navbar-profile">
          <FontAwesomeIcon
            icon={faUserCircle}
            size="2x"
            style={{ color: "white" }}
          />
        </div>
      </nav>
    );
  }
}

export default Navbar;
