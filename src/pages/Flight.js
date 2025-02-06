import React, { useState } from "react";
import "../styles/Flight.css";
import Footer from "../components/Footer";

const FlightPage = () => {
  const booknow = "/images/booknow.svg"
  const Shield = "images/shield.svg"
  const compass = "images/compass.svg"


  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [selectedClass, setSelectedClass] = useState("Economy");
  const [travelers, setTravelers] = useState({ adults: 1, children: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClassChange = (className) => {
    setSelectedClass(className);
  };

  const handleToggleChange = () => {
    setIsRoundTrip(!isRoundTrip);
  };

  const handleTravelersChange = (type, value) => {
    setTravelers((prev) => ({
      ...prev,
      [type]: value < 0 ? 0 : value,
    }));
  };

  return (
    <div className="flight-container">
      {/* Hero Section */}
      <div className="hero-background-flight">
        <img src="images/flightpage_bg.jpg" alt="background" className="background-image" />
      </div>
      <img src="images/airplane_2.png" alt="Airplane" className="airplane-image" />

      <section className={`search-section ${isRoundTrip ? "round-trip" : "one-way"}`}>
        <div className="class-toggle">
          <button
            className={`toggle-button ${selectedClass === "Economy" ? "active" : ""}`}
            onClick={() => handleClassChange("Economy")}
          >
            Economy
          </button>
          <button
            className={`toggle-button ${selectedClass === "Business Class" ? "active" : ""}`}
            onClick={() => handleClassChange("Business Class")}
          >
            Business Class
          </button>
          <button
            className={`toggle-button ${selectedClass === "First Class" ? "active" : ""}`}
            onClick={() => handleClassChange("First Class")}
          >
            First Class
          </button>
          <div className="toggle-trip">
            <span>Round Trip</span>
            <label className="toggle-label">
              <input type="checkbox" checked={isRoundTrip} onChange={handleToggleChange} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="search-fields">
          <div className="search-field">
            <img src="images/location.svg" alt="Location" />
            <span>From</span>
            <input type="text" placeholder="Enter departure" />
          </div>
          <div className="search-field">
            <img src="images/location.svg" alt="Location" />
            <span>To</span>
            <input type="text" placeholder="Enter destination" />
          </div>
          <div className="search-field">
            <img src="images/calendar.svg" alt="Check In" />
            <span>Check In</span>
            <input type="date" />
          </div>
          {isRoundTrip && (
            <div className="search-field">
              <img src="images/calendar.svg" alt="Check Out" />
              <span>Check Out</span>
              <input type="date" />
            </div>
          )}
          <div className="dropdown-field">
            <div
              className="dropdown-header"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <img src="images/person.svg" alt="Travelers" />
              <span>
                {travelers.adults} Adult{travelers.adults !== 1 ? "s" : ""},{" "}
                <br />
                {travelers.children} Child{travelers.children !== 1 ? "ren" : ""}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <label>Adults:</label>
                  <input
                    type="number"
                    min="0"
                    value={travelers.adults}
                    onChange={(e) =>
                      handleTravelersChange("adults", parseInt(e.target.value, 10))
                    }
                  />
                </div>
                <div className="dropdown-item">
                  <label>Children:</label>
                  <input
                    type="number"
                    min="0"
                    value={travelers.children}
                    onChange={(e) =>
                      handleTravelersChange("children", parseInt(e.target.value, 10))
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <button className="search-button">
            <img src="images/search.svg" alt="Search" />
          </button>
        </div>
      </section>

      {/* Travel Support Section */}
      <section className="travel-support">
        <h2 className="travel-support-title">Plan your travel with confidence</h2>
        <p className="travel-support-subtitle">
          Find help with your bookings and travel plans, and see what to expect along your journey.
        </p>
        <div className="travel-support-layout">
          {/* Left Side: Text */}
          <div className="travel-support-left">
            <div className="travel-feature">
              <div className="feature-number">01</div>
              <div>
                <h3 className="feature-title">Hassle-Free Flight Bookings</h3>
                <p className="feature-description">
                  Effortlessly search and book flights with competitive pricing and flexible options to suit your travel plans.
                </p>
              </div>
            </div>
            <div className="travel-feature">
              <div className="feature-number">02</div>
              <div>
                <h3 className="feature-title">Global Destinations at Your Fingertips</h3>
                <p className="feature-description">
                  Access flights to countless destinations worldwide, offering the best routes and airlines for your next adventure.
                </p>
              </div>
            </div>
            <div className="travel-feature">
              <div className="feature-number">03</div>
              <div>
                <h3 className="feature-title">Flexible Travel Options</h3>
                <p className="feature-description">
                  Explore flexible flight options, including round trips and one-way tickets, tailored to your schedule and preferences.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Images */}
          <div className="travel-support-right">
            <img src="images/flight_card02.jpg" alt="Travel 1" className="travel-image travel-image1" />
            <img src="images/flight_card01.jpg" alt="Travel 2" className="travel-image travel-image2" />
            <img src="images/flight_card03.jpg" alt="Travel 3" className="travel-image travel-image3" />
          </div>
        </div>
      </section>
      <section className="trending-destinations">
        <h2 className="section-title">Trending Destinations</h2>
        <p className="section-subtitle">Explore the most popular places to visit around the world.</p>
        <div className="destination-grid">
          {/* <!-- Paris Card --> */}
          <div className="destination-card">
            <div className="destination-image-wrapper">
              <img src="images/paris.jpg" alt="Paris" className="destination-image" />
            </div>
            <div className="hover-content">
              <h3 className="destination-name">Paris</h3>
              <p className="destination-description">Discover the city of love and lights.</p>
              <button className="book-now-button">Book</button>
            </div>
          </div>

          {/* <!-- Alberta Card --> */}
          <div className="destination-card">
            <div className="destination-image-wrapper">
              <img src="images/banff.jpg" alt="Alberta" className="destination-image" />
            </div>
            <div className="hover-content">
              <h3 className="destination-name">Alberta</h3>
              <p className="destination-description">Explore the majestic mountains and lakes.</p>
              <button className="book-now-button">Book</button>
            </div>
          </div>

          {/* <!-- Tokyo Card --> */}
          <div className="destination-card">
            <div className="destination-image-wrapper">
              <img src="images/tokyo.jpg" alt="Tokyo" className="destination-image" />
            </div>
            <div className="hover-content">
              <h3 className="destination-name">Tokyo</h3>
              <p className="destination-description">Experience the blend of tradition and innovation.</p>
              <button className="book-now-button">Book</button>
            </div>
          </div>

          {/* <!-- Rome Card --> */}
          <div className="destination-card">
            <div className="destination-image-wrapper">
              <img src="images/rome3.jpg" alt="Rome" className="destination-image" />
            </div>
            <div className="hover-content">
              <h3 className="destination-name">Rome</h3>
              <p className="destination-description">Step into history with ancient landmarks.</p>
              <button className="book-now-button">Book</button>
            </div>
          </div>
        </div>
      </section>


      <section className="memories-section">
        <div className="memories-header">
          <h2>Travel to make memories all around the world</h2>
        </div>

        <div className="feature-cards-container">
          {/* 1) Book & relax */}
          <div className="bubble-card">
            <div className="icon-circle">
              <img
                src={booknow} alt="Book Now"
                className="feature-icon"
              />

            </div>
            <h3 className="bubble-title">Book & relax</h3>
            <p className="bubble-description">
              We help you from single trip to multi-stop itineraries—
              easy to use.
            </p>
          </div>

          {/* 2) Smart checklist */}
          <div className="bubble-card">
            <div className="icon-circle">
              <img
                src={Shield}
                alt="Shield Icon"
                className="feature-icon"
              />
            </div>
            <h3 className="bubble-title">Smart checklist</h3>
            <p className="bubble-description">
              Flight booking on your mind? We always surface the top trip tips for you!
            </p>
          </div>

          {/* 3) Inspired Getaways */}
          <div className="bubble-card">
            <div className="icon-circle">
              <img
                src={compass}
                alt="comapss Icon"
                className="feature-icon"
              />
            </div>
            <h3 className="bubble-title">Inspired Getaways</h3>
            <p className="bubble-description">
              Open doors to unique destinations and experiences that awaken your wanderlust.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>

  );
};

export default FlightPage;
