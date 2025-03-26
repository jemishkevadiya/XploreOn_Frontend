import React from "react";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const FlightIcon = "/images/flight.svg";
const CarRentalGif = "/images/icons8-car.svg";
const HotelIcon = "/images/hotels.svg";
const CompassIcon = "/images/compass.svg";
const DefaultProfile = "/images/profileicon.svg";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: null,
      isDropdownOpen: false,
    };
  }

  componentDidMount() {
    const auth = getAuth();
    this.unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ isLoggedIn: true, user });
      } else {
        this.setState({ isLoggedIn: false, user: null });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      this.setState({ isLoggedIn: false, user: null, isDropdownOpen: false });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  toggleDropdown = () => {
    this.setState((prevState) => ({ isDropdownOpen: !prevState.isDropdownOpen }));
  };

  handleBrandClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.location.href = "/";
  };

  render() {
    const { isLoggedIn, user, isDropdownOpen } = this.state;

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
          <Link to="/carrentals" className="nav-link">
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
          {isLoggedIn ? (
            <div className="profile-container">
              <img
                src={user?.photoURL || DefaultProfile}  
                alt="Profile"
                className="profile-icon"
                onClick={this.toggleDropdown}
              />
              <span className="user-name">
                {user?.displayName || `${user?.firstName || "User"} ${user?.lastName || ""}`}
              </span>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item-navbar">
                    Profile Dashboard
                  </Link>
                  <Link to="/my-bookings" className="dropdown-item-navbar">
                    My Bookings
                  </Link>
                  <button className="dropdown-item-navbar logout-button" onClick={this.handleLogout}>
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