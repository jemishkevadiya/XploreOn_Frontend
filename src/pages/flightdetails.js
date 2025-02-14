import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoAirplaneOutline } from "react-icons/io5";
import "../styles/FlightDetails.css";
import axios from "axios";

const calculateLayoverTime = (arrivalTime, nextDepartureTime) => {
  if (!arrivalTime || !nextDepartureTime) return "N/A";

  const arrival = new Date(arrivalTime);
  const nextDeparture = new Date(nextDepartureTime);
  const diffInMinutes = Math.floor((nextDeparture - arrival) / (1000 * 60));
  if (diffInMinutes < 0) return "Invalid layover time";

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  return `${hours}h ${minutes}m`;
};

const FlightDetails = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stopsFilter, setStopsFilter] = useState("Any");
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sort, setSort] = useState("BEST");
  const [pageNo, setPageNo] = useState(1);
  const [availableAirlines, setAvailableAirlines] = useState([]);
  const [showAllAirlines, setShowAllAirlines] = useState(false);



  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const [searchParams, setSearchParams] = useState({
    departure: location.state?.departure || "",
    destination: location.state?.destination || "",
    departureDate: location.state?.departureDate || getTodayDate(),
    returnDate: location.state?.returnDate || "",
    travelClass: location.state?.travelClass || "Economy",
    adults: location.state?.adults || 1,
    children: location.state?.children || 0,
    childrenAges: location.state?.childrenAges || [],
    isRoundTrip: location.state?.isRoundTrip || false,
    tripType: location.state?.isRoundTrip ? "roundtrip" : "oneway",
    sort: location.state?.sort || "",
    pageNo,
  });

  const [filters, setFilters] = useState({
    stops: "Any",
    airlines: [],
    priceRange: [0, 10000],
    durationRange: [0, 24],
  });

  const fetchFlights = async (sortOption = searchParams.sort, page = pageNo) => {
    try {
      setLoading(true);
      setError(null);

      const childrenParam = searchParams.children > 0 ? searchParams.childrenAges.join(",") : "";

      const params = {
        origin: searchParams.departure,
        destination: searchParams.destination,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.isRoundTrip ? searchParams.returnDate : undefined,
        adults: searchParams.adults,
        children: childrenParam,
        travelClass: searchParams.travelClass,
        currency_code: "CAD",
        tripType: searchParams.tripType,
        sort: sortOption,
        pageNo: page,
      };

      console.log("📡 Sending API Request with:", params);

      const response = await axios.get("http://localhost:1111/flights/searchFlights", { params });

      const flights = response.data?.data?.flightOffers || [];

      console.log("Extracted Flights:", flights);

      if (flights.length === 0) {
        console.warn("⚠️ No flights found for the given search criteria.");
        setFlights([]);
        setError("No flights available for your search criteria.");
        return;
      }

      const extractAllAirlines = (responseData) => {
        return responseData?.data?.aggregation?.airlines?.map(airline => airline.name) || [];
      };

      const airlines = extractAllAirlines(response.data);


      setFlights(flights);
      setAvailableAirlines(airlines)
      setHasSearched(true);
      setError(null);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError("Failed to fetch flight data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredFlights = flights.filter((flight) => {
    const stops = flight.segments?.[0]?.legs?.length - 1 || 0;
    const airlineName = flight.segments?.[0]?.legs?.[0]?.carriersData?.[0]?.name || "";
    const price = flight.priceBreakdown?.total?.units || 0;


    console.log(`🔍 Filtering flight: Stops=${stops}, Selected Filter=${stopsFilter}`);

    if (stopsFilter === "Direct" && stops !== 0) return false;
    if (stopsFilter === "1 Stop" && stops !== 1) return false;
    if (stopsFilter === "2+ Stops" && stops < 2) return false;

    if (selectedAirlines.length > 0 && !selectedAirlines.includes(airlineName)) {
      return false;
    }

    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    return true;
  });


  const handlePageChange = (newPage) => {
    setPageNo(newPage);
    fetchFlights(sort, newPage);
  };


  useEffect(() => {
    if (hasSearched) {
      fetchFlights(sort, pageNo);
    }
  }, [pageNo, stopsFilter, selectedAirlines]);



  const planeRef = useRef(null);
  const pathRef = useRef(null);

  const handleSortClick = (sortValue) => {
    setSort(sortValue);
    fetchFlights(sortValue, pageNo);
  };

  const handleSearchClick = () => {
    setSearchParams((prev) => {
      const updatedParams = { ...prev };

      if (updatedParams.children > 0) {
        updatedParams.children = updatedParams.childrenAges.join(",");
      } else {
        delete updatedParams.children;
        updatedParams.childrenAges = [];
      }

      if (!updatedParams.sort || updatedParams.sort.trim() === "") {
        updatedParams.sort = sort;
      }

      console.log("🔄 Updated searchParams before search button click:", updatedParams);

      setPageNo(1);
      setFlights([]);
      setHasSearched(true);

      setTimeout(() => {
        fetchFlights(updatedParams.sort, 1);
      }, 50);

      return updatedParams;
    });
  };


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
      tripType: !prev.isRoundTrip ? "roundtrip" : "oneway",
    }));
  };

  const handleClassChange = (className) => {
    setSearchParams((prev) => ({
      ...prev,
      travelClass: className,
    }));
  };

  const handlePriceRangeChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: [prevFilters.priceRange[0], parseInt(event.target.value, 10)]
    }));
  };


  const handleAirlinesChange = (e) => {
    const { value, checked } = e.target;
    setSelectedAirlines((prev) =>
      checked ? [...prev, value] : prev.filter((airline) => airline !== value)
    );
  };

  const handleViewMore = (flight) => {
    setSelectedFlight({
      ...flight,
      origin: flight?.segments?.[0]?.departureAirport?.cityName || "Unknown",
      originCode: flight?.segments?.[0]?.departureAirport?.code || "N/A",
      destination: flight?.segments?.[0]?.arrivalAirport?.cityName || "Unknown",
      destinationCode: flight?.segments?.[0]?.arrivalAirport?.code || "N/A",
      allSegments: flight?.segments || [],
      includedProducts: flight?.includedProducts?.segments?.[0] || [],
      TotalpriceBreakdown: flight?.priceBreakdown || [],
      unifiedPriceBreakdown: flight?.unifiedPriceBreakdown?.items || [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFlight(null);
  };

  const handleTravelersChange = (type, value, index = null) => {
    setSearchParams((prev) => {
      if (type === "children") {
        let childrenAges = prev.childrenAges || [];

        if (value > childrenAges.length) {
          childrenAges = [...childrenAges, ...Array(value - childrenAges.length).fill(5)];
        } else {
          childrenAges = childrenAges.slice(0, value);
        }

        return {
          ...prev,
          children: value,
          childrenAges,
        };
      }

      if (type === "childAge") {
        let updatedAges = [...prev.childrenAges] || [];
        updatedAges[index] = value;

        return {
          ...prev,
          childrenAges: updatedAges,
        };
      }

      return { ...prev, [type]: value };
    });
  };

  const handleProceedToPassengerDetails = () => {
    if (!selectedFlight) {
      alert("Please select a flight first!");
      return;
    }
  
    if (!searchParams.adults || searchParams.adults < 1) {
      alert("At least one adult must be included.");
      return;
    }
  
    console.log("Selected Flight Data:", selectedFlight); 
    console.log(selectedFlight.TotalpriceBreakdown)
    const priceBreakdown = selectedFlight?.priceBreakdown
      ? {
          baseFare: selectedFlight.priceBreakdown.baseFare || { currencyCode: "CAD", units: "N/A" },
          tax: selectedFlight.priceBreakdown.tax || { currencyCode: "CAD", units: "N/A" },
          fee: selectedFlight.priceBreakdown.fee || { currencyCode: "CAD", units: 0 },
          total: selectedFlight.priceBreakdown.total || { currencyCode: "CAD", units: "N/A" },
        }
      : {
          baseFare: { currencyCode: "CAD", units: "N/A" },
          tax: { currencyCode: "CAD", units: "N/A" },
          fee: { currencyCode: "CAD", units: 0 },
          total: { currencyCode: "CAD", units: "N/A" },
        };

        const flightDetails = {
          tripType: searchParams.tripType || "oneway",
          departureCity: searchParams.departure,
          destinationCity: searchParams.destination,
          departureDate: searchParams.departureDate,
          passengers: Array.from({ length: searchParams.adults }, (_, index) => ({
            type: `Adult ${index + 1}`,
          })).concat(
            Array.from({ length: searchParams.children }, (_, index) => ({
              type: `Child ${index + 1}`,
            }))
          ),
        };
  
    console.log("Price Breakdown before Navigation:", priceBreakdown); 
  
    console.log ("Printing passing object: ", flightDetails);

    navigate("/passenger-details", {
      state: {
        departure: searchParams.departure,
        destination: searchParams.destination,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.returnDate || null,
        adults: searchParams.adults || 1,
        children: searchParams.childrenAges.length || 0,
        priceBreakdown: priceBreakdown,
      },
    });
  };
  


  return (
    <div className="flight-info">
      <div className="flight-details">
        <div className="departure">
          {flights.length > 0 && flights[0]?.segments?.[0]?.legs?.[0] ? (
            <>
              <p className="cityName">
                {flights[0]?.segments?.[0]?.legs?.[0]?.departureAirport?.cityName || "Enter Departure"}
              </p>
              <p className="cityCode">
                {flights[0]?.segments?.[0]?.legs?.[0]?.departureAirport?.code || "Enter City Code"}
              </p>
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
          {flights.length > 0 && flights[0]?.segments?.[0]?.legs?.length > 0 ? (
            <>
              <p className="cityName">
                {
                  flights[0]?.segments?.[0]?.legs?.[flights[0]?.segments?.[0]?.legs.length - 1]?.arrivalAirport?.cityName ||
                  "Enter Destination"
                }
              </p>
              <p className="cityCode">
                {
                  flights[0]?.segments?.[0]?.legs?.[flights[0]?.segments?.[0]?.legs.length - 1]?.arrivalAirport?.code ||
                  "Enter City Code"
                }
              </p>
            </>
          ) : (
            <p>No flight information available</p>
          )}
        </div>
      </div>



      {/* Search Section */}
      <section className={`search-section ${searchParams.isRoundTrip ? "roundtrip" : "oneway"}`}>
        <div className="class-toggle">
          <button
            className={`toggle-button ${searchParams.travelClass === "ECONOMY" ? "active" : ""}`}
            onClick={() => handleClassChange("ECONOMY")}
          >
            Economy
          </button>
          <button
            className={`toggle-button ${searchParams.travelClass === "PREMIUM_ECONOMY" ? "active" : ""}`}
            onClick={() => handleClassChange("PREMIUM_ECONOMY")}
          >
            Premium Economy
          </button>
          <button
            className={`toggle-button ${searchParams.travelClass === "BUSINESS" ? "active" : ""}`}
            onClick={() => handleClassChange("BUSINESS")}
          >
            Business Class
          </button>
          <button
            className={`toggle-button ${searchParams.travelClass === "FIRST" ? "active" : ""}`}
            onClick={() => handleClassChange("FIRST")}
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
                {searchParams.adults} Adult{searchParams.adults !== 1 ? "s" : ""},{" "}
                {searchParams.children} Child{searchParams.children !== 1 ? "ren" : ""}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                {/* Adults Input */}
                <div className="dropdown-item">
                  <label>Adults:</label>
                  <input
                    type="number"
                    min="1"
                    value={searchParams.adults}
                    onChange={(e) => handleTravelersChange("adults", parseInt(e.target.value, 10))}
                  />
                </div>

                {/* Children Count Input */}
                <div className="dropdown-item">
                  <label>Children:</label>
                  <input
                    type="number"
                    min="0"
                    value={searchParams.children}
                    onChange={(e) => handleTravelersChange("children", parseInt(e.target.value, 10))}
                  />
                </div>

                {/* Display Child Ages in a Column */}
                <div className="child-age-container">
                  {searchParams.childrenAges.map((age, index) => (
                    <div key={index} className="child-age-item">
                      <label>Child {index + 1} Age:</label>
                      <input
                        type="number"
                        min="0"
                        max="17"
                        value={age}
                        onChange={(e) => handleTravelersChange("childAge", parseInt(e.target.value, 10), index)}
                      />
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
          <button className="search-button" onClick={handleSearchClick}>
            <img src="images/search.svg" alt="Search" />
          </button>
        </div>
      </section>


      {/* Buttons for Cheapest, Best, and Fastest */}
      <div className="filter-buttons">
        <button
          className={`filter-button ${sort === "CHEAPEST" ? "active" : ""}`}
          onClick={() => handleSortClick("CHEAPEST")}
        >
          Cheapest
        </button>
        <button
          className={`filter-button ${sort === "BEST" ? "active" : ""}`}
          onClick={() => handleSortClick("BEST")}
        >
          Best
        </button>
        <button
          className={`filter-button ${sort === "FASTEST" ? "active" : ""}`}
          onClick={() => handleSortClick("FASTEST")}
        >
          Fastest
        </button>
      </div>

      <div className="flight-info-filter">
        {/* Filter Section */}
        <div className="filters">
          <label>Stops:</label>
          <select value={stopsFilter} onChange={(e) => setStopsFilter(e.target.value)}>
            <option value="Any">Any</option>
            <option value="Direct">Direct</option>
            <option value="1 Stop">1 Stop</option>
            <option value="2+ Stops">2+ Stops</option>
          </select>


          <div className="filter">
            <label className="filter-label">Airlines</label>
            <div className="checkboxes">
              {(showAllAirlines ? availableAirlines : availableAirlines.slice(0, 5)).map((airline, index) => (
                <div key={index} className="checkbox-option">
                  <input
                    type="checkbox"
                    id={`airline-${index}`}
                    value={airline}
                    checked={selectedAirlines.includes(airline)}
                    onChange={handleAirlinesChange}
                  />
                  <label htmlFor={`airline-${index}`}>{airline}</label>
                </div>
              ))}

              {/* "Show All" Button */}
              {availableAirlines.length > 5 && (
                <button onClick={() => setShowAllAirlines(prev => !prev)}>
                  {showAllAirlines ? "Show Less" : "Show All"}
                </button>
              )}
            </div>
          </div>



          <div className="filter">
            <label className="filter-label">Price Range (CAD)</label>
            <input
              className="price-range-input"
              type="range"
              min="0"
              max="20000"
              step="50"
              value={filters.priceRange[1]}
              onChange={handlePriceRangeChange}
            />
            <p>${filters.priceRange[0]} - ${filters.priceRange[1]}</p>
          </div>
        </div>

        {hasSearched && (
          <>
            {loading ? (
              <div className="loading-container">
                <div className="loading-animation">
                  <div className="airplane-track">
                    <div className="airplane-icon">✈️</div>
                  </div>
                  <p className="loading-text">Finding the Best Flights for You...</p>
                </div>
              </div>
            ) : error ? (
              <p className="error">{error}</p>
            ) : filteredFlights.length > 0 ? (
              <div className="flight-details-list">
                {filteredFlights.map((flight, index) => {
                  const segment = flight?.segments?.[0];
                  const legs = segment?.legs || [];
                  const stops = legs.length - 1;
                  const carrierData = legs[0]?.carriersData?.[0];
                  const price = `${flight.priceBreakdown?.total?.currencyCode} ${flight.priceBreakdown?.total?.units}`;
                  const airlineName = carrierData?.name || 'Unknown Airline';
                  const airlineLogo = carrierData?.logo || null;
                  const departureCity = segment?.departureAirport?.code || 'Unknown';
                  const arrivalCity = segment?.arrivalAirport?.code || 'Unknown';
                  const departureTime = legs[0]?.departureTime || 'N/A';
                  const arrivalTime = legs[legs.length - 1]?.arrivalTime || 'N/A';

                  const totalMinutes = segment?.totalTime || 0;
                  const hours = Math.floor(totalMinutes / 3600);
                  const minutes = totalMinutes % 60;
                  const formattedTotalTime = `${hours}h ${minutes}m`;

                  const layovers = legs.length > 1
                    ? legs.slice(1).map((leg, idx) => {
                      const prevArrivalTime = new Date(legs[idx].arrivalTime);
                      const nextDepartureTime = new Date(leg.departureTime);
                      const layoverDuration = Math.abs(nextDepartureTime - prevArrivalTime) / (1000 * 60);
                      return `${Math.floor(layoverDuration / 60)}h ${layoverDuration % 60}m`;
                    })
                    : [];

                  return (
                    <div key={index} className="flight-detail">
                      <div className="flight-summary">
                        <div className="flight-summary-header">
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
                            <p className="flight-time-departure"><strong>Departure:</strong> {departureTime}</p>
                            <p className="flight-time-arrival"><strong>Arrival:</strong> {arrivalTime}</p>
                            <p className="flight-total-time"><strong>Total Time:</strong> {formattedTotalTime}</p>
                            <p className="flight-stops">
                              <strong>Stops:</strong> {stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`}
                            </p>
                            {layovers.length > 0 && (
                              <p className="flight-layover">
                                <strong>Layovers:</strong> {layovers.join(', ')}
                              </p>
                            )}
                            <p className="flight-price"><strong>Price:</strong> {price}</p>
                          </div>
                        </div>
                        <button className="flight-viewmore" onClick={() => handleViewMore(flight)}>View More</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <p className="error">No flights available.</p>
              </>
            )}
          </>
        )}


        {/* View More Modal */}
        {isModalOpen && selectedFlight && (
          <div className="flight-details-modal">
            <div className="modal-overlay">
              <div className="modal-content">
                {/* Close Button */}
                <button className="close-btn-flight" onClick={closeModal}>✖</button>

                {/* Header */}
                <div className="modal-header">
                  <h2>Your Flight to {selectedFlight.destination || "Destination"}</h2>
                </div>

                {/* Modal Body (Two-Column Layout) */}
                <div className="modal-body">
                  {/* Left Side: Flight Route & Segments */}
                  <div className="modal-left">
                    <div className="flight-route-model">
                      <div className="flight-departure">
                        <strong>From:</strong>
                        <p>{selectedFlight.origin} ({selectedFlight.originCode})</p>
                      </div>
                      <div className="flight-arrow">✈</div>
                      <div className="flight-arrival">
                        <strong>To:</strong>
                        <p>{selectedFlight.destination} ({selectedFlight.destinationCode})</p>
                      </div>
                    </div>

                    {/* Flight Segments */}
                    <div className="flight-segments">
                      {selectedFlight?.allSegments?.map((segment, segmentIndex) => (
                        <div key={segmentIndex} className="segment">
                          <h3>Flight Segment {segmentIndex + 1} {segmentIndex === 0 ? "(Departure)" : "(Return)"}</h3>
                          {segment.legs.map((leg, legIndex) => (
                            <div key={legIndex} className="flight-leg">
                              <p><strong>Airline:</strong> {leg.carriersData?.[0]?.name || "Unknown Airline"}</p>
                              <p><strong>Departure:</strong> {leg.departureAirport?.code} - {leg.departureTime}</p>
                              <p><strong>Arrival:</strong> {leg.arrivalAirport?.code} - {leg.arrivalTime}</p>
                              {legIndex < segment.legs.length - 1 && (
                                <p><strong>Layover:</strong> {calculateLayoverTime(leg.arrivalTime, segment.legs[legIndex + 1]?.departureTime)}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: Baggage & Price Breakdown */}
                  <div className="modal-right">
                    {/* Baggage Info */}
                    <div className="baggage-info">
                      <h3>Baggage Information</h3>
                      {selectedFlight?.includedProducts?.length > 0 ? (
                        selectedFlight.includedProducts.map((baggage, index) => (
                          <div key={index} className="baggage-item">
                            <p><strong>Type:</strong> {baggage.luggageType || "N/A"}</p>
                            <p><strong>Max Pieces:</strong> {baggage.maxPiece || "N/A"}</p>
                            <p><strong>Piece Per Passenger:</strong> {baggage.piecePerPax || "N/A"}</p>
                            {baggage.maxWeightPerPiece && (
                              <p><strong>Max Weight:</strong> {baggage.maxWeightPerPiece} {baggage.massUnit || "kg"}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p>No baggage information available.</p>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div className="price-breakdown">
                      <h3>Price Breakdown</h3>
                      {selectedFlight?.unifiedPriceBreakdown?.length > 0 ? (
                        selectedFlight.unifiedPriceBreakdown.map((item, index) => (
                          <div key={index} className="price-item">
                            <p><strong>Scope:</strong> {item.scope || "N/A"}</p>
                            <p><strong>Title:</strong> {item.title || "N/A"}</p>
                            <p><strong>Price:</strong> {item.price?.currencyCode} {item.price?.units.toFixed(2)}</p>
                          </div>
                        ))
                      ) : (
                        <p>No price breakdown available.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="modal-buttons">
                  <button className="book-now-btn-flight" onClick={() => handleProceedToPassengerDetails(selectedFlight)}>
                    Proceed to Passenger Details</button>
                  <button className="close-btn-flight" onClick={closeModal}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}



      </div>
      {flights.length > 0 && (
        <div className="pagination">
          <button
            disabled={pageNo === 1}
            onClick={() => handlePageChange(pageNo - 1)}
          >
            Previous
          </button>

          <span>Page {pageNo}</span>

          <button
            onClick={() => handlePageChange(pageNo + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightDetails;
