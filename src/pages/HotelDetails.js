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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [adults, setAdults] = useState(locationState.state?.adults || 1);
  const [children, setChildren] = useState(locationState.state?.children || 0);
  const [rooms, setRooms] = useState(locationState.state?.rooms || 1);
  const [hotelOptions, setHotelOptions] = useState([]);
  const [filtersData, setFiltersData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortOption, setSortOption] = useState("best-value");
  const [loading, setLoading] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [isModified, setIsModified] = useState(false);


  useEffect(() => {
    if (locationState.state?.checkIn && locationState.state?.checkOut) {
      console.log("Navigation state received:", locationState.state);

      const parseDateAsUTC = (dateString) => {
        const [year, month, day] = dateString.split("-").map(Number);

        return new Date(Date.UTC(year, month-1 , day+1));
      };

      const checkInDate = parseDateAsUTC(locationState.state.checkIn);
      const checkOutDate = parseDateAsUTC(locationState.state.checkOut);

      console.log("Parsed check-in date:", checkInDate.toISOString());
      console.log("Parsed check-out date:", checkOutDate.toISOString());

      setStartDate(checkInDate);
      setEndDate(checkOutDate);
      setLocation(locationState.state.location);
      setAdults(locationState.state.adults || 1);
      setChildren(locationState.state.children || 0);
      setRooms(locationState.state.rooms || 1);


      setHasSearched(true);
    }
  }, [locationState]);


  const fetchFilters = async () => {
    if (!location || !startDate || !endDate) return;

    try {
      setLoadingFilters(true);
      const formattedCheckIn = startDate.toISOString().split("T")[0];
      const formattedCheckOut = endDate.toISOString().split("T")[0];

      const response = await axios.get("http://localhost:1111/hotels/filters", {
        params: {
          location,
          checkIn: formattedCheckIn,
          checkOut: formattedCheckOut,
        },
      });
      console.log("Filters API Response:", response.data);
      const filters = response.data?.data?.filters || [];
      setFiltersData(filters);
      console.log("Updated filtersData:", filters);
    } catch (error) {
      console.error("Error fetching filters:", error.response?.data || error.message);
      setFiltersData([]);
    } finally {
      setLoadingFilters(false);
    }
  };


  const fetchHotelData = async (page = pageNo) => {
    try {
      if (!location || !startDate || !endDate) {
        return;
      }
      setLoading(true);
      const formattedCheckIn = startDate.toISOString().split("T")[0];
      const formattedCheckOut = endDate.toISOString().split("T")[0];

      const filterValues = Object.entries(selectedFilters)
        .filter(([key, value]) => value)
        .map(([_, value]) => value);
      const categoriesFilter = filterValues.length > 0 ? filterValues.join(",") : undefined;

      console.log("Fetching hotels with params:", {
        location,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        person: adults + children,
        roomQty: rooms,
        page_number: page,
        categories_filter: categoriesFilter || "None",
      });

      const params = {
        location,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        person: adults + children,
        roomQty: rooms,
        page_number: page,
      };

      if (categoriesFilter) {
        params.categories_filter = categoriesFilter;
      }

      const response = await axios.get("http://localhost:1111/hotels/hotels", {
        params,
      });
      setHotelOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching hotels:", error.response?.data || error.message);
      setHotelOptions([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (hasSearched && !isModified) {
      console.log("Triggering initial search on navigation");
      fetchFilters();
      fetchHotelData();
    }
  }, [hasSearched]);


  useEffect(() => {
    console.log("fetchHotelData useEffect triggered with:", { hasSearched, pageNo, selectedFilters });
    if (hasSearched) {
      fetchHotelData();
    }
  }, [pageNo, selectedFilters]);


  const handleFieldChange = (setter, isDate = false) => (value) => {
    setIsModified(true);
    if (isDate) {

      setter(value);
    } else {

      setter(value.target.value);
    }
  };

  const handleGuestChange = (type, operation) => {
    setIsModified(true);
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

  const handleCheckboxFilterChange = (field, genericId, checked) => {
    setSelectedFilters((prev) => {
      const currentFieldFilters = prev[field] ? prev[field].split(",") : [];
      let updatedFieldFilters;

      if (checked) {
        updatedFieldFilters = [...new Set([...currentFieldFilters, genericId])];
      } else {
        updatedFieldFilters = currentFieldFilters.filter((id) => id !== genericId);
      }

      const updatedFilters = {
        ...prev,
        [field]: updatedFieldFilters.length > 0 ? updatedFieldFilters.join(",") : undefined,
      };

      setPageNo(1);
      return updatedFilters;
    });
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    const sortedHotels = [...hotelOptions].sort((a, b) => {
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

  const handleSearch = async () => {
    if (!location || !startDate || !endDate) {
      alert("Please fill in all fields: location, check-in date, and check-out date.");
      return;
    }

    const formattedCheckIn = startDate.toISOString().split("T")[0];
    const formattedCheckOut = endDate.toISOString().split("T")[0];

    setPageNo(1);
    setHasSearched(true);
    setIsModified(false);
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

    await fetchFilters();
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
  };

  const SkeletonHotelCard = () => (
    <div className="hotel-card_hoteldetails skeleton">
      <div className="hotel-image_hoteldetails skeleton-image"></div>
      <div className="hotel-info_hoteldetails">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-price"></div>
        <div className="skeleton-text skeleton-score"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );

  const SkeletonFilterSection = () => (
    <div className="filter-section_hoteldetails skeleton">
      <div className="skeleton-text skeleton-section-title"></div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <div className="skeleton-text skeleton-filter-option"></div>
        </div>
      ))}
    </div>
  );

  const filteredFiltersData = () => {
    console.log("Original filtersData:", filtersData);
    const landmarksIndex = filtersData.findIndex((filter) => filter.title === "Landmarks");
    let filtered = landmarksIndex === -1 ? filtersData : filtersData.slice(0, landmarksIndex + 1);
    console.log("Filtered filtersData:", filtered);
    return filtered;
  };

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
              onChange={handleFieldChange(setLocation)}
            />
          </div>

          <div className="input-field_hoteldetails">
            <BsFillCalendarDateFill className="icon_hoteldetails" />
            <DatePicker
              selected={startDate}
              onChange={handleFieldChange(setStartDate, true)}
              placeholderText="Check-in Date"
              className="date-picker-input_hoteldetails"
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="input-field_hoteldetails">
            <BsFillCalendarDateFill className="icon_hoteldetails" />
            <DatePicker
              selected={endDate}
              onChange={handleFieldChange(setEndDate, true)}
              placeholderText="Check-out Date"
              className="date-picker-input_hoteldetails"
              minDate={startDate || new Date()}
              dateFormat="yyyy-MM-dd"
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
          {loadingFilters ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonFilterSection key={index} />
              ))}
            </>
          ) : hasSearched && filtersData.length > 0 ? (
            filteredFiltersData().map((filter, index) =>
              filter.field === "price" ? null : (
                <div key={index}>
                  <h3>{filter.title}</h3>
                  <div className="filter-section_hoteldetails">
                    {filter.filterStyle === "CHECKBOX" ? (
                      filter.options.map((option, optIndex) => {
                        console.log(
                          `Filter: ${filter.title}, Option: ${option.title}, Count: ${option.countNotAutoextended}`
                        );
                        return (
                          <label key={optIndex}>
                            <input
                              type="checkbox"
                              checked={
                                selectedFilters[filter.field]?.includes(option.genericId) || false
                              }
                              onChange={(e) =>
                                handleCheckboxFilterChange(
                                  filter.field,
                                  option.genericId,
                                  e.target.checked
                                )
                              }
                            />
                            {option.title} ({option.countNotAutoextended || 0})
                          </label>
                        );
                      })
                    ) : null}
                  </div>
                </div>
              )
            )
          ) : (
            <p>Press the Search button to load filters.</p>
          )}
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
            ) : hasSearched && hotelOptions.length > 0 ? (
              <div className="hotel-options-wrapper_hoteldetails">
                <div className="hotel-cards_hoteldetails">
                  {hotelOptions.map((hotel, index) => (
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
                          {hotel.property?.priceBreakdown?.grossPrice?.value
                            ? Number(hotel.property.priceBreakdown.grossPrice.value).toFixed(2)
                            : "N/A"}
                        </p>
                        <p>
                          Review Score: {hotel.property?.reviewScore || "N/A"} (
                          {hotel.property?.reviewScoreWord || ""})
                        </p>
                        {hotel.property?.specialOffer && (
                          <span className="special-offer_hoteldetails">Special offer</span>
                        )}
                        <button
                          className="view-deal_hoteldetails"
                          onClick={() => handleViewDetails(hotel)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
              </div>
            ) : (
              <p>Press the Search button to load hotels.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;