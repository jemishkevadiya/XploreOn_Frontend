import React, { useState, useEffect, useRef } from 'react';
import '../styles/FlightDetails.css';

const FlightDetails = () => {
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [selectedClass, setSelectedClass] = useState("Economy");
  const [travelers, setTravelers] = useState({ adults: 1, children: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Filter States
  const [stopsFilter, setStopsFilter] = useState("Any");
  const [airlinesFilter, setAirlinesFilter] = useState("Any");
  const [durationFilter, setDurationFilter] = useState("Any");

  const planeRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const plane = planeRef.current;

    // Path length
    const pathLength = path.getTotalLength();

    let startTime;
    const animatePlane = (timestamp) => {
      if (!startTime) startTime = timestamp;

      // Calculate the progress (percentage)
      const progress = (timestamp - startTime) / 4000; // 3000ms (3 seconds)
      const offset = progress * pathLength; // How far along the path the plane should be

      // If we reach the end, reset the animation
      if (progress >= 1) startTime = timestamp; // Reset the timer

      // Get the point at the current position along the path
      const point = path.getPointAtLength(offset);
      plane.setAttribute("x", point.x - 17); // Adjust for plane icon size (if needed)
      plane.setAttribute("y", point.y + 17); // Adjust for plane icon size (if needed)

      // Request the next frame
      requestAnimationFrame(animatePlane);
    };

    requestAnimationFrame(animatePlane);
  }, []);

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
    <div className="flight-info">
      <div className="flight-details">
        <div className="departure">
          <p className="city">Moscow</p>
          <p className="airport">SFO</p>
          <p className="time">14:45</p>
        </div>
        <div className="flight-linepath">
          <svg width="1000" height="100">
            {/* Curved dotted path */}
            <path
              ref={pathRef}
              d="M 10 50 Q 550 10, 1110 60"
              fill="transparent"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            {/* Start and End black circles */}
            <circle cx="10" cy="50" r="6" fill="black" />
            <circle cx="994" cy="50" r="6" fill="black" />
            {/* Plane icon (using the Unicode airplane symbol) */}
            <text ref={planeRef} x="10" y="45" fontSize="65" fill="black">&#9992;</text>
          </svg>
        </div>

        <div className="arrival">
          <p className="city">New York</p>
          <p className="airport">NYC</p>
          <p className="time">17:25</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filter-section">
        <div className="filter">
          <label>Stops</label>
          <select value={stopsFilter} onChange={(e) => setStopsFilter(e.target.value)}>
            <option value="Any">Any</option>
            <option value="Non-stop">Non-stop</option>
            <option value="1 stop">1 stop</option>
            <option value="2 stops">2 stops</option>
          </select>
        </div>
        <div className="filter">
          <label>Airlines</label>
          <select value={airlinesFilter} onChange={(e) => setAirlinesFilter(e.target.value)}>
            <option value="Any">Any</option>
            <option value="Delta">Delta</option>
            <option value="American Airlines">American Airlines</option>
            <option value="United">United</option>
          </select>
        </div>
        <div className="filter">
          <label>Duration</label>
          <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}>
            <option value="Any">Any</option>
            <option value="Under 5h">Under 5h</option>
            <option value="5-10h">5-10h</option>
            <option value="Over 10h">Over 10h</option>
          </select>
        </div>
      </div>

      {/* Search Section */}
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

      {/* Buttons for Cheapest, Best, and Fastest */}
      <div className="filter-buttons">
        <button className="filter-button">Cheapest</button>
        <button className="filter-button">Best</button>
        <button className="filter-button">Fastest</button>
      </div>
    </div>
  );
};

export default FlightDetails;
