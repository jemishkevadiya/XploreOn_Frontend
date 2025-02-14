import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { IoAirplaneOutline } from 'react-icons/io5';
import '../styles/FlightDetails.css';
import axios from 'axios';

const FlightDetails = () => {
  const location = useLocation();

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stopsFilter, setStopsFilter] = useState("Any");
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [searchParams, setSearchParams] = useState({
    departure: location.state?.departure || "",
    destination: location.state?.destination || "",
    departureDate: location.state?.departureDate || getTodayDate(),
    returnDate: location.state?.returnDate || "",
    travelClass: location.state?.travelClass || "Economy",
    travelers: location.state?.travelers || { adults: 1, children: 0 },
    isRoundTrip: location.state?.isRoundTrip || false,
    tripType: location.state?.isRoundTrip ? "round-trip" : "oneway",
  });
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
  
        console.log("🔹 Fetching flights with params:", searchParams);
  
        const params = {
          origin: searchParams.departure,
          destination: searchParams.destination,
          departureDate: searchParams.departureDate,
          returnDate: searchParams.isRoundTrip ? searchParams.returnDate : undefined,
          passengers: searchParams.travelers.adults,
          travelClass: searchParams.travelClass,
          currency_code: "CAD",
          tripType: searchParams.tripType,
        };
  
        console.log("🔹 Final API Params:", params);
  
        const response = await axios.get("http://localhost:1111/flights/searchFlights", { params });
  
        console.log("API Full Response:", response.data);
  
        const flights =
          response.data?.data?.flightOffers ||
          response.data?.data?.flightDeals ||
          [];
  
        console.log("Extracted Flights:", flights);
  
        if (flights.length === 0) {
          console.warn("⚠️ No flights found for the given search criteria.");
          setFlights([]); // Ensure state is updated to an empty array
          setError("No flights available for your search criteria.");
          return;
        }
  
        setFlights(flights);
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        setError("Failed to fetch flight data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchFlights();
  }, [searchParams]);
  
  const planeRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    if (!flights.length) return;
    const path = pathRef.current;
    const plane = planeRef.current;
    const pathLength = path.getTotalLength();

    let startTime;
    const animatePlane = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = (timestamp - startTime) / 7000;
      const offset = progress * pathLength;

      if (progress >= 1) startTime = timestamp;

      const point = path.getPointAtLength(offset);
      plane.setAttribute("x", point.x - 17);
      plane.setAttribute("y", point.y + 17);

      requestAnimationFrame(animatePlane);
    };

    requestAnimationFrame(animatePlane);
  }, [flights]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = () => {
    setSearchParams((prev) => ({
      ...prev,
      isRoundTrip: !prev.isRoundTrip,
      returnDate: !prev.isRoundTrip ? prev.returnDate : "",
      tripType: !prev.isRoundTrip ? "round-trip" : "oneway",
    }));
  };

  const handleClassChange = (className) => {
    setSearchParams((prev) => ({ ...prev, travelClass: className }));
  };

  const handleStopsChange = (e) => {
    setStopsFilter(e.target.value);
  };

  const handleAirlinesChange = (e) => {
    const { value, checked } = e.target;
    setSelectedAirlines((prev) =>
      checked ? [...prev, value] : prev.filter((airline) => airline !== value)
    );
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFlight(null);
  };

  const handleTravelersChange = (type, value) => {
    setSearchParams((prev) => ({
      ...prev,
      travelers: {
        ...prev.travelers,
        [type]: value < 0 ? 0 : value,
      },
    }));
  };

  return (
    <div className="flight-info">
      <div className="flight-details">
        <div className="departure">
          {flights.length > 0 ? (
            <>
              <p className="cityName">{flights[0]?.departureCity || "Enter Departure"}</p>
              <p className="cityCode">{flights[0]?.departureCityCode || "Enter City Code"}</p>
              <p className="time">{flights[0]?.departureTime || "TBD"}</p>
            </>
          ) : (
            <p>No flight information available</p>
          )}

        </div>

        <div className="flight-linepath">
          <svg width="1000" height="100">
            <path ref={pathRef} d="M 10 50 Q 550 10, 1110 60" fill="transparent" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="10" cy="50" r="6" fill="black" />
            <circle cx="994" cy="50" r="6" fill="black" />
            <text ref={planeRef} x="10" y="45" fontSize="65" fill="black">&#9992;</text>
          </svg>
        </div>

        <div className="arrival">
          <p className="cityName">{flights[0]?.arrivalCity || "Enter Destination"}</p>
          <p className="cityCode">{flights[0]?.arrivalCityCode || "Enter City Code"}</p>
          <p className="time">{flights[0]?.arrivalTime || "TBD"}</p>
        </div>
      </div>



      {/* Search Section */}
      <section className={`search-section ${searchParams.isRoundTrip ? "round-trip" : "oneway"}`}>
        <div className="class-toggle">
          <button
            className={`toggle-button ${searchParams.travelClass === "Economy" ? "active" : ""}`}
            onClick={() => handleClassChange("Economy")}
          >
            Economy
          </button>
          <button
            className={`toggle-button ${searchParams.travelClass === "Business Class" ? "active" : ""}`}
            onClick={() => handleClassChange("Business Class")}
          >
            Business Class
          </button>
          <button
            className={`toggle-button ${searchParams.travelClass === "First Class" ? "active" : ""}`}
            onClick={() => handleClassChange("First Class")}
          >
            First Class
          </button>
          <div className="toggle-trip">
            <span>Round Trip</span>
            <label className="toggle-label">
              <input type="checkbox" checked={searchParams.isRoundTrip} onChange={handleToggleChange} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="search-fields">
          <div className="search-field">
            <span>From</span>
            <input type="text" name="departure" value={searchParams.departure} onChange={handleInputChange} />
          </div>
          <div className="search-field">
            <span>To</span>
            <input type="text" name="destination" value={searchParams.destination} onChange={handleInputChange} />
          </div>
          <div className="search-field">
            <span>Departure</span>
            <input type="date" name="departureDate" value={searchParams.departureDate} min={getTodayDate()} onChange={handleInputChange} />
          </div>
          {searchParams.isRoundTrip && (
            <div className="search-field">
              <span>Return</span>
              <input type="date" name="returnDate" value={searchParams.returnDate} min={searchParams.departureDate} onChange={handleInputChange} />
            </div>
          )}
          <div className="dropdown-field">
            <div className="dropdown-header" onClick={() => setIsDropdownOpen((prev) => !prev)}>
              <span>
                {searchParams.travelers.adults} Adult{searchParams.travelers.adults !== 1 ? "s" : ""},{" "}
                {searchParams.travelers.children} Child{searchParams.travelers.children !== 1 ? "ren" : ""}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <label>Adults:</label>
                  <input type="number" min="1" value={searchParams.travelers.adults} onChange={(e) => handleTravelersChange("adults", parseInt(e.target.value, 10))} />
                </div>
                <div className="dropdown-item">
                  <label>Children:</label>
                  <input type="number" min="0" value={searchParams.travelers.children} onChange={(e) => handleTravelersChange("children", parseInt(e.target.value, 10))} />
                </div>
              </div>
            )}
          </div>
          <button className="search-button" onClick={() => window.location.reload()}>
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

      <div className="flight-info-filter">


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
                <label htmlFor="any-stop">Any</label>
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
                  id="united-airlines2"
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
                  id="united-airlines3"
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

        {loading ? (
          <p>Loading flights...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : flights.length > 0 ? (
          <div className="flight-details-list">
            {flights.map((flight, index) => {
              const segment = flight?.segments?.[0];
              const leg = segment?.legs?.[0];
              const carrierData = leg?.carriersData?.[0];

              const airlineName = carrierData?.name || 'Unknown Airline';
              const airlineLogo = carrierData?.logo || null;
              const departureCity = segment?.departureAirport?.city || 'Unknown';
              const arrivalCity = segment?.arrivalAirport?.city || 'Unknown';
              const departureTime = leg?.departureTime || 'N/A';
              const arrivalTime = leg?.arrivalTime || 'N/A';
              const price = `${flight.priceBreakdown?.total?.currencyCode} ${flight.priceBreakdown?.total?.units}`;

              return (
                <div key={index} className="flight-detail">
                  <div className="flight-logo">
                    {airlineLogo ? (
                      <img src={airlineLogo} alt={airlineName} />
                    ) : (
                      <p>No logo available</p>
                    )}
                  </div>
                  <div className="flight-info-container">
                    <h3>{airlineName}</h3>
                    <div className="flight-route">
                      <span>{departureCity}</span>
                      <IoAirplaneOutline className="flight-icon" />
                      <span>{arrivalCity}</span>
                    </div>
                    <p><strong>Departure:</strong> {departureTime}</p>
                    <p><strong>Arrival:</strong> {arrivalTime}</p>
                    <p className="flight-price"><strong>Price:</strong> {price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <p className="error">No flights available.</p>
            <pre>{JSON.stringify(flights, null, 2)}</pre> {/* Debugging output */}
          </>
        )}

        {isModalOpen && selectedFlight && (
          <div className="flight-details-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Your flight to {selectedFlight.arrivalCity}</h2>
              </div>
              <div className="modal-body">
                <div className="modal-airline">
                  <img
                    src={selectedFlight.logo}
                    alt={selectedFlight.airline}
                    className="modal-airline-logo"
                  />
                  <h3>{selectedFlight.airline}</h3>
                </div>

                {/* Departure & Arrival Details */}
                <div className="flight-departure-arrival">
                  <div className="flight-departure">
                    <strong>Departure:</strong>
                    <p>{selectedFlight.departureCity} ({selectedFlight.departureCityCode}) - {selectedFlight.departureTime}</p>
                  </div>
                  <div className="flight-arrival">
                    <strong>Arrival:</strong>
                    <p>{selectedFlight.arrivalCity} ({selectedFlight.arrivalCityCode}) - {selectedFlight.arrivalTime}</p>
                  </div>
                </div>

                {/* Round Trip Check */}
                {searchParams.isRoundTrip && selectedFlight.returnFlight && (
                  <div className="flight-departure-arrival">
                    <div className="flight-departure">
                      <strong>Return Departure:</strong>
                      <p>{selectedFlight.returnFlight.departureCity} ({selectedFlight.returnFlight.departureCityCode}) - {selectedFlight.returnFlight.departureTime}</p>
                    </div>
                    <div className="flight-arrival">
                      <strong>Return Arrival:</strong>
                      <p>{selectedFlight.returnFlight.arrivalCity} ({selectedFlight.returnFlight.arrivalCityCode}) - {selectedFlight.returnFlight.arrivalTime}</p>
                    </div>
                  </div>
                )}

                <div className="baggage-info">
                  <strong>Included Baggage:</strong>
                  <p>{selectedFlight.baggage}</p>
                </div>

                <div className="extra-baggage">
                  <strong>Extra Baggage:</strong>
                  <p>{selectedFlight.extraBaggage}</p>
                </div>

                <div className="fare-rules">
                  <strong>Fare Rules:</strong>
                  <p>{selectedFlight.fareRules}</p>
                </div>

                <div className="co2-emissions">
                  <strong>CO2 Emissions Estimate:</strong>
                  <p>{selectedFlight.co2Emissions}</p>
                </div>

                <div className="modal-price">
                  <strong>Price:</strong>
                  <p>{selectedFlight.price}</p>
                </div>

                <div className="buttons">
                  <button className="close-btn" onClick={closeModal}>Close</button>
                  <button className="book-now-btn">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightDetails;
