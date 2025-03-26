import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearchLocation, FaUserFriends } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/HotelDetails.css";

const HotelDetails = () => {
  const locationState = useLocation();
  const navigate = useNavigate();

  // Initialize search bar state with passed values
  const [location, setLocation] = useState(locationState.state?.location || "");
  const [startDate, setStartDate] = useState(
    locationState.state?.checkIn ? new Date(locationState.state.checkIn) : null
  );
  const [endDate, setEndDate] = useState(
    locationState.state?.checkOut ? new Date(locationState.state.checkOut) : null
  );
  const [adults, setAdults] = useState(locationState.state?.guests?.adults || 1);
  const [children, setChildren] = useState(locationState.state?.guests?.children || 0);

  const [hotelOptions, setHotelOptions] = useState([]);
  const [filters, setFilters] = useState({
    refundable: false,
    prepayment: false,
    specialOffers: false,
    amenities: [],
  });
  const [sortOption, setSortOption] = useState("best-value");

  const fetchHotelData = async () => {
    try {
      if (!location || !startDate || !endDate) {
        console.log("Missing required search params:", { location, startDate, endDate });
        return;
      }
      const formattedCheckIn = startDate.toISOString().split("T")[0];
      const formattedCheckOut = endDate.toISOString().split("T")[0];

      console.log("Fetching hotels with params:", {
        location,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        person: adults + children,
        roomQty: 1,
      });
      const response = await axios.get("http://localhost:1111/hotels/hotels", {
        params: {
          location,
          checkIn: formattedCheckIn,
          checkOut: formattedCheckOut,
          person: adults + children,
          roomQty: 1,
        },
      });
      console.log("Hotel API Response:", response.data);
      setHotelOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching hotels:", error.response?.data || error.message);
      setHotelOptions([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    fetchHotelData();
  }, [location, startDate, endDate, adults, children]);

  const handleGuestChange = (type, operation) => {
    if (type === "adults") {
      if (operation === "increment") setAdults((prev) => prev + 1);
      if (operation === "decrement" && adults > 1) setAdults((prev) => prev - 1);
    } else {
      if (operation === "increment") setChildren((prev) => prev + 1);
      if (operation === "decrement" && children > 0) setChildren((prev) => prev - 1);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    const sortedHotels = [...hotelOptions].sort((a, b) => {
      const getPrice = (hotel) => {
        const price = hotel.property?.priceBreakdown?.grossPrice?.value || 0;
        return isNaN(price) || price > 1000000 ? 0 : price; // Fallback to 0 for invalid/large values
      };

      if (newSortOption === "price-low-to-high") {
        return getPrice(a) - getPrice(b);
      } else if (newSortOption === "price-high-to-low") {
        return getPrice(b) - getPrice(a);
      }
      return 0; // Default to no sorting for "best-value"
    });
    setHotelOptions(sortedHotels);
  };

  const filteredHotels = hotelOptions.filter((hotel) => {
    const grossPrice = hotel.property?.priceBreakdown?.grossPrice?.value || 0;
    const matchesRefundable = !filters.refundable || hotel.property?.refundable;
    const matchesPrepayment = !filters.prepayment || !hotel.property?.prepaymentNeeded;
    const matchesSpecialOffers = !filters.specialOffers || hotel.property?.specialOffer;
    const matchesAmenities =
      filters.amenities.length === 0 ||
      filters.amenities.every((amenity) => hotel.property?.amenities?.includes(amenity));
    return matchesRefundable && matchesPrepayment && matchesSpecialOffers && matchesAmenities;
  });

  const handleSearch = async () => {
    if (!location || !startDate || !endDate) {
      alert("Please fill in all fields: location, check-in date, and check-out date.");
      return;
    }

    const formattedCheckIn = startDate.toISOString().split("T")[0];
    const formattedCheckOut = endDate.toISOString().split("T")[0];

    navigate("/hoteldetails", {
      state: {
        location,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        guests: { adults, children, rooms: 1 },
      },
    });
    await fetchHotelData();
  };

  const handleViewDetails = (hotel) => {
    const formattedCheckIn = startDate.toISOString().split("T")[0];
    const formattedCheckOut = endDate.toISOString().split("T")[0];

    // Extract price details and accessibility label
    const priceBreakdown = hotel.property?.priceBreakdown || {};
    const priceData = {
      grossPrice: priceBreakdown.grossPrice?.value || 0,
      excludedPrice: priceBreakdown.excludedPrice?.value || 0,
      currency: priceBreakdown.grossPrice?.currency || "C$",
    };
    const accessibilityLabel = hotel.accessibilityLabel || "N/A";

    navigate(`/hotel/${hotel.hotel_id}`, {
      state: {
        arrivalDate: formattedCheckIn,
        departureDate: formattedCheckOut,
        priceData,
        accessibilityLabel,
      },
    });
  };

  return (
    <div className="hotel-details-page_hoteldetails">
      {/* Search Bar */}
      <div className="search-bar-container_hoteldetails">
        <div className="search-bar_hoteldetails">
          <div className="input-field_hoteldetails">
            <FaSearchLocation className="icon_hoteldetails" />
            <input
              type="text"
              placeholder="Where you want to go?..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="input-field_hoteldetails">
            <BsFillCalendarDateFill className="icon_hoteldetails" />
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              placeholderText="Check-in Date"
              className="date-picker-input_hoteldetails"
              minDate={new Date()}
            />
          </div>

          <div className="input-field_hoteldetails">
            <BsFillCalendarDateFill className="icon_hoteldetails" />
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              placeholderText="Check-out Date"
              className="date-picker-input_hoteldetails"
              minDate={startDate || new Date()}
            />
          </div>

          <div className="input-field_hoteldetails guest-selector_hoteldetails">
            <FaUserFriends className="icon_hoteldetails" />
            <div className="guest-controls_hoteldetails">
              <div className="guest-type_hoteldetails">
                <button
                  className="guest-button_hoteldetails"
                  onClick={() => handleGuestChange("adults", "decrement")}
                  disabled={adults <= 1}
                >
                  -
                </button>
                <span className="guest-count_hoteldetails">
                  {adults} Adult{adults !== 1 && "s"}
                </span>
                <button
                  className="guest-button_hoteldetails"
                  onClick={() => handleGuestChange("adults", "increment")}
                >
                  +
                </button>
              </div>
              <div className="guest-type_hoteldetails">
                <button
                  className="guest-button_hoteldetails"
                  onClick={() => handleGuestChange("children", "decrement")}
                  disabled={children <= 0}
                >
                  -
                </button>
                <span className="guest-count_hoteldetails">
                  {children} Child{children !== 1 && "ren"}
                </span>
                <button
                  className="guest-button_hoteldetails"
                  onClick={() => handleGuestChange("children", "increment")}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button className="search-btn_hoteldetails" onClick={handleSearch}>
            Search →
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="content_hoteldetails">
        {/* Filter Sidebar */}
        <div className="filter-sidebar_hoteldetails">
          <h3>Deals</h3>
          <div className="filter-section_hoteldetails">
            <label>
              <input
                type="checkbox"
                checked={filters.refundable}
                onChange={(e) => handleFilterChange("refundable", e.target.checked)}
              />
              Fully refundable
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.prepayment}
                onChange={(e) => handleFilterChange("prepayment", e.target.checked)}
              />
              No prepayment needed
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.specialOffers}
                onChange={(e) => handleFilterChange("specialOffers", e.target.checked)}
              />
              Properties with Special Offers
            </label>
          </div>

          <h3>Amenities</h3>
          <div className="filter-section_hoteldetails">
            <label>
              <input
                type="checkbox"
                value="Pool"
                onChange={(e) => {
                  const updatedAmenities = e.target.checked
                    ? [...filters.amenities, e.target.value]
                    : filters.amenities.filter((amenity) => amenity !== e.target.value);
                  handleFilterChange("amenities", updatedAmenities);
                }}
              />
              Pool
            </label>
            <label>
              <input
                type="checkbox"
                value="WiFi"
                onChange={(e) => {
                  const updatedAmenities = e.target.checked
                    ? [...filters.amenities, e.target.value]
                    : filters.amenities.filter((amenity) => amenity !== e.target.value);
                  handleFilterChange("amenities", updatedAmenities);
                }}
              />
              WiFi
            </label>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content_hoteldetails">
          <div className="sort-section_hoteldetails">
            <label>Sort by: </label>
            <select value={sortOption} onChange={handleSortChange}>
              <option value="best-value">Best Value</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
            </select>
          </div>

          <div className="hotel-options_hoteldetails">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel, index) => (
                <div key={index} className="hotel-card_hoteldetails">
                  <img
                    src={hotel.property?.photoUrls?.[0] || "https://via.placeholder.com/150"}
                    alt={hotel.property?.name}
                    className="hotel-image_hoteldetails"
                  />
                  <div className="hotel-info_hoteldetails">
                    <h3>{hotel.property?.name || "Unknown Hotel"}</h3>
                    <p>
                      Price: C$
                      {hotel.property?.priceBreakdown?.grossPrice?.value ||
                        (hotel.property?.priceBreakdown?.grossPrice?.value +
                          (hotel.property?.priceBreakdown?.excludedPrice?.value || 0)) ||
                        "N/A"}
                    </p>
                    <p>Review Score: {hotel.property?.reviewScore || "N/A"} ({hotel.property?.reviewScoreWord || ""})</p>
                    <p>Capacity: {hotel.accessibilityLabel?.match(/\d+\s*beds/)?.[0] || "N/A"}</p>
                    {hotel.property?.specialOffer && <span className="special-offer_hoteldetails">Special offer</span>}
                    <button
                      className="view-deal_hoteldetails"
                      onClick={() => handleViewDetails(hotel)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Sorry, we couldn't find any search results matching your criteria.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;