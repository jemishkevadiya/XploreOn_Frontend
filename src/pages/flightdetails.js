import React, { useState, useEffect, useRef } from 'react';
import { IoAirplaneOutline } from 'react-icons/io5';
import "../styles/FlightDetails.css";


const FlightDetails = () => {
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [selectedClass, setSelectedClass] = useState("Economy");
  const [travelers, setTravelers] = useState({ adults: 1, children: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [stopsFilter, setStopsFilter] = useState("Any");
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  const planeRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const plane = planeRef.current;

    const pathLength = path.getTotalLength();

    let startTime;
    const animatePlane = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = (timestamp - startTime) / 4000; 
      const offset = progress * pathLength; 

      if (progress >= 1) startTime = timestamp;

      const point = path.getPointAtLength(offset);
      plane.setAttribute("x", point.x - 17); 
      plane.setAttribute("y", point.y + 17); 

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

  const handleStopsChange = (e) => {
    setStopsFilter(e.target.value);
  };

  const handleAirlinesChange = (e) => {
    const { value, checked } = e.target;
    setSelectedAirlines((prev) =>
      checked
        ? [...prev, value]
        : prev.filter((airline) => airline !== value)
    );
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

      {/* Filter Section */}
      <div className="filters">
        <div className="filter">
          <label className="filter-label">Stops</label>
          <div className="filter-options">
            <div className="filter-option">
              <input
                type="radio"
                id="any-stop"
                name="stops"
                value="Any"
                checked={stopsFilter === 'Any'}
                onChange={handleStopsChange}
              />
              <label htmlFor="any-stop"> <div>Any </div></label>
            </div>
            <div className="filter-option">
              <input
                type="radio"
                id="direct-only"
                name="stops"
                value="Direct only"
                checked={stopsFilter === 'Direct only'}
                onChange={handleStopsChange}
              />
              <label htmlFor="direct-only">Direct only</label>
            </div>
            <div className="filter-option">
              <input
                type="radio"
                id="one-stop-max"
                name="stops"
                value="1 stop max"
                checked={stopsFilter === '1 stop max'}
                onChange={handleStopsChange}
              />
              <label htmlFor="one-stop-max">1 stop max</label>
            </div>
          </div>
        </div>

        <div className="filter">
          <label className="filter-label">Airlines</label>
          <div className="checkboxes">
            <div className="checkbox-option">
              <input
                type="checkbox"
                id="porter-airlines"
                value="Porter Airlines"
                checked={selectedAirlines.includes('Porter Airlines')}
                onChange={handleAirlinesChange}
              />
              <label htmlFor="porter-airlines">Porter Airlines</label>
              <span>40</span>
            </div>

            <div className="checkbox-option">
              <input
                type="checkbox"
                id="flair-airlines"
                value="Flair Airlines"
                checked={selectedAirlines.includes('Flair Airlines')}
                onChange={handleAirlinesChange}
              />
              <label htmlFor="flair-airlines">Flair Airlines</label>
              <span>2</span>
            </div>

            <div className="checkbox-option">
              <input
                type="checkbox"
                id="air-canada"
                value="Air Canada"
                checked={selectedAirlines.includes('Air Canada')}
                onChange={handleAirlinesChange}
              />
              <label htmlFor="air-canada">Air Canada</label>
              <span>191</span>
            </div>

            <div className="checkbox-option">
              <input
                type="checkbox"
                id="american-airlines"
                value="American Airlines"
                checked={selectedAirlines.includes('American Airlines')}
                onChange={handleAirlinesChange}
              />
              <label htmlFor="american-airlines">American Airlines</label>
              <span>28</span>
            </div>

            <div className="checkbox-option">
              <input
                type="checkbox"
                id="united-airlines"
                value="United Airlines"
                checked={selectedAirlines.includes('United Airlines')}
                onChange={handleAirlinesChange}
              />
              <label htmlFor="united-airlines">United Airlines</label>
              <span>98</span>
            </div>

            <div className="checkbox-option">
              <input
                type="checkbox"
                id="united-airlines"
                value="United Airlines"
                checked={selectedAirlines.includes('United Airlines')}
                onChange={handleAirlinesChange}
              />
              <label htmlFor="united-airlines">United Airlines</label>
              <span>98</span>
            </div>

            <div className="checkbox-option">
              <input
                type="checkbox"
                id="united-airlines"
                value="United Airlines"
                checked={selectedAirlines.includes('United Airlines')}
                onChange={handleAirlinesChange}
              />
              <label htmlFor="united-airlines">United Airlines</label>
              <span>98</span>
            </div>

            <div className="checkbox-option">
              <input
                type="checkbox"
                id="united-airlines"
                value="United Airlines"
                checked={selectedAirlines.includes('United Airlines')}
                onChange={handleAirlinesChange}
              />
              <label htmlFor="united-airlines">United Airlines</label>
              <span>98</span>
            </div>

            <div className="show-all">
              <button>Show all</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FlightDetails;