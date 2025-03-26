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

  const [location, setLocation] = useState(locationState.state?.location || "");
  const [startDate, setStartDate] = useState(
    locationState.state?.checkIn ? new Date(locationState.state.checkIn) : null
  );
  const [endDate, setEndDate] = useState(
    locationState.state?.checkOut ? new Date(locationState.state.checkOut) : null
  );
  const [adults, setAdults] = useState(locationState.state?.adults || 1);
  const [children, setChildren] = useState(locationState.state?.children || 0);
  const [rooms, setRooms] = useState(locationState.state?.rooms || 1);
  const [hotelOptions, setHotelOptions] = useState([]);
  const [filters, setFilters] = useState({
    refundable: false,
    prepayment: false,
    specialOffers: false,
    amenities: [],
    priceRange: [0, 10000], 
  });
  const [sortOption, setSortOption] = useState("best-value");
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);

  const fetchHotelData = async (page = pageNo) => {
    try {
      if (!location || !startDate || !endDate) {
        console.log("Missing required search params:", { location, startDate, endDate });
        return;
      }
      setLoading(true);
      const formattedCheckIn = startDate.toISOString().split("T")[0];
      const formattedCheckOut = endDate.toISOString().split("T")[0];

      console.log("Fetching hotels with params:", {
        location,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        person: adults + children,
        roomQty: rooms,
        page_number: page,
      });
      const response = await axios.get("http://localhost:1111/hotels/hotels", {
        params: {
          location,
          checkIn: formattedCheckIn,
          checkOut: formattedCheckOut,
          person: adults + children,
          roomQty: rooms,
          page_number: page,
        },
      });
      console.log("Hotel API Response:", response.data);
      setHotelOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching hotels:", error.response?.data || error.message);
      setHotelOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelData();
  }, [location, startDate, endDate, adults, children, rooms, pageNo]);

  const handleGuestChange = (type, operation) => {
    if (type === "adults") {
      if (operation === "increment") setAdults((prev) => prev + 1);
      if (operation === "decrement" && adults > 1) setAdults((prev) => prev - 1);
    } else if (type === "children") {
      if (operation === "increment") setChildren((prev) => prev + 1);
      if (operation === "decrement" && children > 0) setChildren((prev) => prev - 1);
    } else if (type === "rooms") {
      if (operation === "increment") setRooms((prev) => prev + 1);
      if (operation === "decrement" && rooms > 1) setRooms((prev) => prev - 1);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setPageNo(1); 
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    const sortedHotels = [...filteredHotels].sort((a, b) => {
      const getPrice = (hotel) => {
        const price = hotel.property?.priceBreakdown?.grossPrice?.value || 0;
        return isNaN(price) || price > 1000000 ? 0 : price;
      };

      if (newSortOption === "price-low-to-high") {
        return getPrice(a) - getPrice(b);
      } else if (newSortOption === "price-high-to-low") {
        return getPrice(b) - getPrice(a);
      }
      return 0;
    });
    setHotelOptions(sortedHotels);
  };


  const filteredHotels = hotelOptions.filter((hotel) => {
    const grossPrice = hotel.property?.priceBreakdown?.grossPrice?.value || 0;


    if (filters.refundable && !hotel.property?.refundable) return false;


    if (filters.prepayment && hotel.property?.prepaymentNeeded) return false;


    if (filters.specialOffers && !hotel.property?.specialOffer) return false;


    if (
      filters.amenities.length > 0 &&
      !filters.amenities.every((amenity) => hotel.property?.amenities?.includes(amenity))
    ) {
      return false;
    }


    if (grossPrice < filters.priceRange[0] || grossPrice > filters.priceRange[1]) return false;

    return true;
  });

  const handleSearch = async () => {
    if (!location || !startDate || !endDate) {
      alert("Please fill in all fields: location, check-in date, and check-out date.");
      return;
    }

    const formattedCheckIn = startDate.toISOString().split("T")[0];
    const formattedCheckOut = endDate.toISOString().split("T")[0];

    setPageNo(1);
    navigate("/hoteldetails", {
      state: {
        location,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        adults,
        children,
        rooms,
      },
    });
    await fetchHotelData(1);
  };

  const handleViewDetails = (hotel) => {
    const formattedCheckIn = startDate.toISOString().split("T")[0];
    const formattedCheckOut = endDate.toISOString().split("T")[0];

    const priceBreakdown = hotel.property?.priceBreakdown || {};
    const priceData = {
      grossPrice: priceBreakdown.grossPrice?.value || 0,
      excludedPrice: priceBreakdown.excludedPrice?.value || 0,
      currency: priceBreakdown.grossPrice?.currency || "C$",
    };
    const accessibilityLabel = hotel.accessibilityLabel || "N/A";

    navigate(`/hotel/${hotel.hotel_id}`, {
      state: {
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        adults,
        children,
        rooms,
        priceData,
        accessibilityLabel,
      },
    });
  };

  const handlePageChange = (newPage) => {
    setPageNo(newPage);
    fetchHotelData(newPage);
  };

  const SkeletonHotelCard = () => (
    <div className="hotel-card_hoteldetails skeleton">
      <div className="hotel-image_hoteldetails skeleton-image"></div>
      <div className="hotel-info_hoteldetails">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-price"></div>
        <div className="skeleton-text skeleton-score"></div>
        <div className="skeleton-text skeleton-capacity"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );

  return (
    <div className="hotel-details-page_hoteldetails">
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
              <div className="guest-type_hoteldetails">
                <button
                  className="guest-button_hoteldetails"
                  onClick={() => handleGuestChange("rooms", "decrement")}
                  disabled={rooms <= 1}
                >
                  -
                </button>
                <span className="guest-count_hoteldetails">
                  {rooms} Room{rooms !== 1 && "s"}
                </span>
                <button
                  className="guest-button_hoteldetails"
                  onClick={() => handleGuestChange("rooms", "increment")}
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

      <div className="content_hoteldetails">
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

          <h3>Price Range (CAD)</h3>
          <div className="filter-section_hoteldetails">
            <input
              type="range"
              min="0"
              max="10000"
              step="50"
              value={filters.priceRange[1]}
              onChange={(e) =>
                handleFilterChange("priceRange", [filters.priceRange[0], parseInt(e.target.value, 10)])
              }
            />
            <p>
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </p>
          </div>
        </div>

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
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonHotelCard key={index} />
                ))}
              </>
            ) : filteredHotels.length > 0 ? (
              <>
                {filteredHotels.map((hotel, index) => (
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
                ))}
                <div className="pagination_hoteldetails">
                  <button
                    className="pagination-btn_hoteldetails pagination-prev_hoteldetails"
                    disabled={pageNo === 1}
                    onClick={() => handlePageChange(pageNo - 1)}
                  >
                    Previous
                  </button>
                  <span className="pagination-page_hoteldetails">Page {pageNo}</span>
                  <button
                    className="pagination-btn_hoteldetails pagination-next_hoteldetails"
                    onClick={() => handlePageChange(pageNo + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
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