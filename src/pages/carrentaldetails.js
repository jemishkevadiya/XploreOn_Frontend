import React, { useState } from "react";
import "../styles/carrentaldetails.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FaSearchLocation } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";

const CarRentalDetails = () => {
  const [PickupDate, setPickupDate] = useState(null);
  const [ReturnDate, setReturnDate] = useState(null);


  const handleSearch = () => {
    if (!PickupDate || !ReturnDate) {
      alert("Please select both pickup and return date/time.");
      return;
    }
    console.log("Pickup Date & Time:", PickupDate.toISOString());
    console.log("Return Date & Time:", ReturnDate.toISOString());
  };

  const cars = [
    {
      id: 1,
      name: "Tesla Model S",
      type: "Standard",
      image: "/images/carmain.jpg",
      features: ["5 seats", "Electric", "Unlimited mileage"],
      price: 124,
      specialDeal: true,
      supplier: "Alamo",
      passengers: 5,
    },
    {
      id: 2,
      name: "Ford Fiesta",
      type: "Compact",
      image: "/images/carmain.jpg",  
      features: ["4 seats", "Petrol", "Manual"],
      price: 99,
      specialDeal: false,
      supplier: "National",
      passengers: 4,
    },
    {
      id: 3,
      name: "Toyota Corolla",
      type: "Medium",
      image: "/images/carmain.jpg",
      features: ["5 seats", "Hybrid", "Unlimited mileage"],
      price: 110,
      specialDeal: true,
      supplier: "dollar",
      passengers: 5,
    },
    {
      id: 4,
      name: "Honda Odyssey",
      type: "Large",
      image: "/images/carmain.jpg",
      features: ["7 seats", "Petrol", "Automatic"],
      price: 140,
      specialDeal: false,
      supplier: "Thrifty",
      passengers: 7,
    },
    {
      id: 5,
      name: "Jeep Wrangler",
      type: "SUV",
      image: "/images/carmain.jpg",
      features: ["5 seats", "4x4", "Unlimited mileage"],
      price: 150,
      specialDeal: false,
      supplier: "Hertz",
      passengers: 5,
    },
  ];

  const [filters, setFilters] = useState({
    type: ["Standard", "Compact", "Medium", "Large", "SUV"], 
    supplier: ["Alamo", "National", "dollar", "Thrifty", "Hertz"], 
    minPrice: 0,
    maxPrice: 200,
    passengers: [4, 5, 7], 
  });

  const [sortBy, setSortBy] = useState("Best match");

  const handleFilterChange = (field, value, checked) => {
    setFilters((prevFilters) => {
      if (checked) {
        return { ...prevFilters, [field]: [...prevFilters[field], value] };
      } else {
        return {
          ...prevFilters,
          [field]: prevFilters[field].filter((item) => item !== value),
        };
      }
    });
  };

  const filteredCars = cars.filter((car) => {
    const matchesType = filters.type.includes(car.type);
    const matchesSupplier = filters.supplier.includes(car.supplier);
    const matchesPrice =
      car.price >= filters.minPrice && car.price <= filters.maxPrice;
    const matchesPassengers = filters.passengers.includes(car.passengers);

    return matchesType && matchesSupplier && matchesPrice && matchesPassengers;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === "Price (Low to High)") return a.price - b.price;
    if (sortBy === "Price (High to Low)") return b.price - a.price;
    return 0;
  });

  return (
    <div>
      {/* Search Section */}
      <div className="search-bar-container-carrentaldetail">
        <div className="search-bar-carrentaldetail">
          <div className="input-field-carrentaldetail">
            <FaSearchLocation className="iconcar" />
            <input type="text" placeholder="Pick-up Location" />
          </div>
          <div className="input-field-carrentaldetail">
            <FaSearchLocation className="iconcar" />
            <input type="text" placeholder="Return Location" />
          </div>
          <div className="input-field-carrentaldetail">
            <BsFillCalendarDateFill className="iconcar" />
            <DatePicker
              selected={PickupDate}
              onChange={setPickupDate}
              placeholderText="Pick-up Date & Time"
              className="date-picker-input"
              minDate={new Date()}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          <div className="input-field-carrentaldetail">
            <BsFillCalendarDateFill className="iconcar" />
            <DatePicker
              selected={ReturnDate}
              onChange={setReturnDate}
              placeholderText="Return Date & Time"
              className="date-picker-input"
              minDate={PickupDate || new Date()}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          <button className="search-btn-carrentaldetail" onClick={handleSearch}>
            Search →
          </button>
        </div>
      </div>

      {/* Car Details Section */}
      <div className="car-details-page">
        {/* Filter Section */}
        <div className="filter-section">
          <h2>Filter by</h2>
          <div className="filter-category">
            <h3>Car Type</h3>
            <ul>
              {["Standard", "Compact", "Medium", "Large", "SUV"].map((type) => (
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
            <h3>Supplier</h3>
            <ul>
              {["Alamo", "National", "dollar", "Thrifty", "Hertz"].map((supplier) => (
                <li key={supplier}>
                  <input
                    type="checkbox"
                    value={supplier}
                    checked={filters.supplier.includes(supplier)}
                    onChange={(e) =>
                      handleFilterChange(
                        "supplier",
                        e.target.value,
                        e.target.checked
                      )
                    }
                  />
                  {supplier}
                </li>
              ))}
            </ul>
          </div>
          <div className="filter-category">
            <h3>Price Range</h3>
            <input
              type="range"
              min="0"
              max="200"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  maxPrice: Number(e.target.value),
                }))
              }
            />
            <div>Up to ${filters.maxPrice}</div>
          </div>
          <div className="filter-category">
            <h3>Passenger</h3>
            <ul>
              {[4, 5, 7].map((count) => (
                <li key={count}>
                  <input
                    type="checkbox"
                    value={count}
                    checked={filters.passengers.includes(count)}
                    onChange={(e) =>
                      handleFilterChange(
                        "passengers",
                        Number(e.target.value),
                        e.target.checked
                      )
                    }
                  />
                  {count} Seats
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Listings Section */}
        <div className="listings-section">
          <div className="listings-header">
            <span className="results-count">{sortedCars.length} results</span>
            <div className="sort-by">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Best match">Best match</option>
                <option value="Price (Low to High)">Price (Low to High)</option>
                <option value="Price (High to Low)">Price (High to Low)</option>
              </select>
            </div>
          </div>
          <div className="car-listings">
            {sortedCars.map((car) => (
              <div className="car-card" key={car.id}>
                <img src={car.image} alt={car.name} />
                <h4>{car.name}</h4>
                <h3>{car.type}</h3>
                <ul className="features">
                  {car.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <div className="price">${car.price.toFixed(2)} per day</div>
                <button className="reserve-button">Reserve deal</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRentalDetails;