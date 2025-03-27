
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/carrentaldetails.css";
import DatePicker from "react-datepicker";
import { useLocation } from "react-router-dom";

const CarRentalDetails = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [sortedCars, setSortedCars] = useState([]);
  const [sortOption, setSortOption] = useState("best-match");
  const [filters, setFilters] = useState({
    type: [],
    supplier: [],
    maxPrice: 600,
    passengers: [],
  });
  
  const location = useLocation();
  const carSearchParams = location.state;
  const [pickupLocation, setPickupLocation] = useState(carSearchParams.pickupLocation || "");
  const [returnLocation, setReturnLocation] = useState(carSearchParams.dropOffLocation || "");
  const [PickupDate, setPickupDate] = useState(new Date(carSearchParams?.pickUpDate + 'T' + carSearchParams?.pickUpTime) || new Date()); // Initialize PickupDate with both date and time
  const [ReturnDate, setReturnDate] = useState(new Date(carSearchParams?.dropOffDate + 'T' + carSearchParams?.dropOffTime) || new Date()); // Initialize ReturnDate with both date and time


  useEffect(() => {
    if (carSearchParams) {
      fetchCars(carSearchParams);
    }
  }, [carSearchParams]); 
 
 


  const fetchCars = async (params) => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔹 Final API Params:", params);

      const response = await axios.get( `${process.env.REACT_APP_API_URL}/car_rental/search`||"http://localhost:1111/car_rental/search", { params });

      console.log("API Full Response:", response.data);

      const cars = response.data?.data?.search_results || [];

      console.log("Extracted Car Rentals:", cars);

      if (cars.length === 0) {
        console.warn("⚠️ No cars found for the given search criteria.");
        setCars([]);
        setError("No cars available for your search criteria.");
        return;
      }

      setCars(cars);
      setError(null);
      applyFiltersAndSort(cars, filters, sortOption);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch car rental data. Please try again.");
    } finally {
      setLoading(false);
    }


  };

  useEffect(() => {
    if (carSearchParams.pickupLocation && carSearchParams.dropOffLocation
      && carSearchParams.pickUpDate && carSearchParams.dropOffDate) {
      fetchCars({
        pickupLocation: carSearchParams.pickupLocation,
        dropOffLocation: carSearchParams.dropOffLocation,
        pickUpDate: carSearchParams.pickUpDate,
        dropOffDate: carSearchParams.dropOffDate,
        pickUpTime: carSearchParams.pickUpTime,
        dropOffTime: carSearchParams.dropOffTime,
        currencyCode: carSearchParams.currencyCode,
      });
    }
  }, [carSearchParams]);

  console.log();
  // Open the modal and set the selected car
  const openModal = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const handleSearch = () => {

    if (!pickupLocation || !returnLocation || !PickupDate || !ReturnDate) {
      alert("All fields are required (Pick-up Location, Return Location, Dates).");
      return;
    }

    const pickUpDate = PickupDate.toISOString().split('T')[0];
    const pickUpTime = PickupDate.toISOString().split('T')[1].slice(0, 5);

    const dropOffDate = ReturnDate.toISOString().split('T')[0];
    const dropOffTime = ReturnDate.toISOString().split('T')[1].slice(0, 5);
 if (!pickupLocation || !returnLocation || !pickUpDate || !ReturnDate){
  alert("All fields ae required")
  return;
 }
    const updatedParams = {
      pickupLocation: pickupLocation,
      dropOffLocation: returnLocation,
      pickUpDate: pickUpDate,
      dropOffDate: dropOffDate,
      pickUpTime: pickUpTime,
      dropOffTime: dropOffTime,
      currencyCode: carSearchParams.currencyCode || "CAD",
    };

    console.log("Updated search parameters:", updatedParams);
    fetchCars(updatedParams);
  };

  const handleCarBooking = async ()=>{
    try{
      const user = localStorage.getItem("user")
      const userObject = JSON.parse(user); 
      const uid = userObject.uid;
      const payload = {
        "userId": uid,
        "totalAmount": selectedCar?.pricing_info?.price?.toFixed(2),
        "rentalDetails": {
          "carName": selectedCar?.vehicle_info?.v_name,
          "pickUpDate": PickupDate,
          "dropOffDate": ReturnDate,
          "pickupLocation": pickupLocation,
          "dropOffLocation": returnLocation
        }
      }
      console.log(payload.rentalDetails);
      const response = await axios.post( `${process.env.REACT_APP_API_URL}/car_rental/carbooking`||"http://localhost:1111/car_rental/carbooking", payload);
      if (response.status === 200 || response.status === 201){
        window.location.href = response.data.paymentUrl
      }else{
        setError("Error Booking Car.");
      }
    }catch(e){
      setError("Error Booking Car.");
      console.log(e);
    }
  }

  const handleFilterChange = (category, value, isChecked) => {
    setFilters((prevFilters) => {
      const updatedCategory = isChecked
        ? [...prevFilters[category], value]
        : prevFilters[category].filter((item) => item !== value);

      setSortOption("best-match");

      return { ...prevFilters, [category]: updatedCategory };
    });
  };
  useEffect(() => {
    if (cars.length > 0) {
      applyFiltersAndSort(cars, filters, sortOption);
    }
  }, [filters, sortOption, cars]);

  const handlePriceRangeChange = (e) => {
    const price = e.target.value;
    setFilters((prevFilters) => {

      return { ...prevFilters, maxPrice: price };
    });
  };

  const applyFiltersAndSort = (cars, filters, sortOption) => {
    if (!Array.isArray(cars)) {
      console.warn("cars is not an array:", cars);
      return;
    }

    let filteredCarsList = cars.filter((car) => {

      const vehicleInfo = car.vehicle_info || {};
      const isCarTypeMatch =
        filters.type.length === 0 || filters.type.includes(vehicleInfo.group); 



      const price = car.pricing_info?.price || 0;
      const isPriceMatch = price <= filters.maxPrice; 


      const seats = vehicleInfo?.seats || 0;
      const isPassengerMatch =
        filters.passengers.length === 0 || filters.passengers.includes(seats); 

      return isCarTypeMatch && isPriceMatch && isPassengerMatch;
    });

    console.log("Filtered Cars Count:", filteredCarsList.length); 


    let sortedCarsList = [...filteredCarsList];
    switch (sortOption) {
      case "price-low-to-high":
        sortedCarsList.sort((a, b) => (a.pricing_info?.price || 0) - (b.pricing_info?.price || 0));
        break;
      case "price-high-to-low":
        sortedCarsList.sort((a, b) => (b.pricing_info?.price || 0) - (a.pricing_info?.price || 0));
        break;
      case "best-match":
      default:
        sortedCarsList.sort((a, b) => (b.rating_info?.average || 0) - (a.rating_info?.average || 0));
        break;
    }

    console.log("Sorted Cars Count:", sortedCarsList.length); 
    setSortedCars(sortedCarsList); 
  };


  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    applyFiltersAndSort(cars, filters, newSortOption);
  };


  return (
    <div>
      <div className="search-bar-container-carrentaldetail">
        <div className="search-bar-carrentaldetail">
        <div className="input-field-carrentaldetail">
          <input
            type="text"
            placeholder="Pick-up Location"
            value={pickupLocation}  
            onChange={(e) => setPickupLocation(e.target.value)} 
          />
        </div>
        <div className="input-field-carrentaldetail">
          <input
            type="text"
            placeholder="Return Location"
            value={returnLocation}  
            onChange={(e) => setReturnLocation(e.target.value)} 
          />
        </div>
        <div className="input-field-carrentaldetail">
        <DatePicker
          selected={PickupDate}  
          onChange={setPickupDate}  
          placeholderText="Pick-up Date & Time"
          minDate={new Date()}  
          showTimeSelect 
          timeFormat="HH:mm"  
          dateFormat="MMMM d, yyyy h:mm aa" 
        />
      </div>

      <div className="input-field-carrentaldetail">
        <DatePicker
          selected={ReturnDate}  
          onChange={setReturnDate}  
          placeholderText="Return Date & Time"
          minDate={PickupDate || new Date()}  
          showTimeSelect  
          timeFormat="HH:mm" 
          dateFormat="MMMM d, yyyy h:mm aa"  
        />
      </div>
          <button className="search-btn-carrentaldetail" onClick={handleSearch}>
            Search →
          </button>
        </div>
      </div>
      <div className="car-details-page">
        <div className="filter-section">
          <h2>Filter by</h2>

          <div className="filter-category">
            <h3>Car Type</h3>
            <ul>
              {["Luxury", "Standard", "Full-size", "Compact", "Intermediate", "Premium", "Economy"].map((type) => (
                <li key={type}>
                  <input
                    type="checkbox"
                    value={type}
                    checked={filters.type.includes(type)}
                    onChange={(e) =>
                      handleFilterChange("type", e.target.value, e.target.checked)
                    }
                  />
                  {type}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-category">
            <h3>Price Range</h3>
            <input
              type="range"
              min="0"
              max="600"
              value={filters.maxPrice}
              onChange={handlePriceRangeChange}
            />
            <div>Up to ${filters.maxPrice}+</div>
          </div>

          <div className="filter-category">
            <h3>Passenger Seats</h3>
            <ul>
              {[4, 5, 7].map((count) => (
                <li key={count}>
                  <input
                    type="checkbox"
                    value={count}
                    checked={filters.passengers.includes(count)}
                    onChange={(e) =>
                      handleFilterChange("passengers", Number(e.target.value), e.target.checked)
                    }
                  />
                  {count} Seats or more
                </li>
              ))}
            </ul>
          </div>


        </div>
        <div className="car-details-page">
          {loading ? (
            <p>Loading cars...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : cars.length === 0 ? (
            <p>No cars available for the given parameters.</p>
          ) : (
            <div className="listings-section">
              <div className="listings-header">
                <span className="results-count">{cars.length} results</span>
                <div className="sort-by">
                  <label htmlFor="sort">Sort by:</label>
                  <select id="sort" onChange={handleSortChange} value={sortOption}>
                    <option value="best-match">Best match</option>
                    <option value="price-low-to-high">Price (Low to High)</option>
                    <option value="price-high-to-low">Price (High to Low)</option>
                  </select>
                </div>

              </div>

              <div className="car-listings">
                {(sortedCars.length > 0 ? sortedCars : cars).map((car, index) => {
                  const vehicle = car.vehicle_info;
                  const pricing = car.pricing_info;

                  return (
                    <div key={car.vehicle_id} className="car-card">
                      <div className="card-front">
                        <img src={vehicle.image_url} alt={vehicle.v_name} />
                        <h4>{vehicle.v_name}</h4>
                        <h3>{vehicle.group}</h3>
                        <div className="price">
                          {pricing.currency} {pricing.price.toFixed(2)}
                        </div>
                        <button
                          className="reserve-button"
                          onClick={() => openModal(car)}
                        >
                          Reserve deal
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isModalOpen && selectedCar && (
            <div className="_carrental modal">
              <div className="modal-content">
                <span className="close-button" onClick={closeModal}>
                  &times;
                </span>
                <div className="modal-body-carrental">
                  <div className="details-section">
                    <h3>{selectedCar?.vehicle_info?.v_name}</h3>
                    <p><strong>Type:</strong> {selectedCar?.vehicle_info?.group}</p>
                    <p><strong>Transmission:</strong> {selectedCar?.vehicle_info?.transmission}</p>
                    <p><strong>Fuel Type:</strong> {selectedCar?.vehicle_info?.fuel_type}</p>
                    <p><strong>Seats:</strong> {selectedCar?.vehicle_info?.seats}</p>
                    <p><strong>Doors:</strong> {selectedCar?.vehicle_info?.doors}</p>
                  </div>
                  <div className="right-section">
                    <p><strong>Pick-up Location:</strong> {selectedCar?.route_info?.pickup?.address}</p>
                    <p><strong>Drop-off Location:</strong> {selectedCar?.route_info?.dropoff?.address}</p>
                    <p><strong>Mileage:</strong> {selectedCar?.vehicle_info?.mileage}</p>
                    <p><strong>Supplier:</strong> {selectedCar?.supplier_info?.name}</p>
                    <p><strong>Special Offer:</strong> {selectedCar?.vehicle_info?.special_offer_text || 'No offers available'}</p>
                  </div>
                </div>

                <div className="rating-section">
                  <h3>Car Ratings</h3>
                  <div className="progress-bar-container">
                    <h5>Overall Review</h5>
                    <div className="progress-bar-background">
                      <div
                        className="progress-bar-foreground"
                        style={{
                          width: `${(selectedCar?.rating_info?.average || 0) * 10}%`,
                        }}
                      ></div>
                    </div>
                    <div className="rating-text">
                      <strong>{selectedCar?.rating_info?.average || 0}</strong>
                      <span> / 10</span>
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <h5>Value for Money</h5>
                    <div className="progress-bar-background">
                      <div
                        className="progress-bar-foreground"
                        style={{
                          width: `${(selectedCar?.rating_info?.value_for_money || 0) * 10}%`,
                        }}
                      ></div>
                    </div>
                    <div className="rating-text">
                      <strong>{selectedCar?.rating_info?.value_for_money || 0}</strong>
                      <span> / 10</span>
                    </div>
                  </div>
                </div>
                <div className="pricing-section">
                  <p className="total-price">
                    <strong>Total Price:</strong> {selectedCar?.pricing_info?.currency} {selectedCar?.pricing_info?.price?.toFixed(2)}
                  </p>
                  <p className="info-text">
                    * All taxes and prices included
                  </p>

                  <button onClick={handleCarBooking} className="reserve-button">Confirm Reservation</button>
                </div>

              </div>
            </div>


          )}
        </div>
      </div>

    </div>

  );

};

export default CarRentalDetails;