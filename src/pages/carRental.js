import React, { useState } from "react";
import '../styles/carRental.css';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FaSearchLocation } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";

const CarRental = () => {
    const [PickupDate, setPickupDate] = useState(null);
    const [ReturnDate, setReturnDate] = useState(null);

    const handleSearch = () => {
        if (!PickupDate || !ReturnDate) {
            alert("Please select both pickup and return date/time.");
            return;
        }

        console.log("Pickup Date & Time:", PickupDate.toISOString()); // Store in database
        console.log("Return Date & Time:", ReturnDate.toISOString());

        // You can now send these dates to your backend or store them
    };
    const backgroundImage = "/images/carmain.jpg";

    return (
      <div className="hotel-container">
        <div className="heroo-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <h1 className="main-title-car">From Short Trips to Long Drives<br></br> We've Got You Covered</h1>
          
          <div className="search-bar-container-car">
            <div className="search-bar-car">
              <div className="input-field-car">
                <FaSearchLocation className="icon" />
                <input type="text" placeholder="Pick-up Location" />
              </div>

              <div className="input-field-car">
                <FaSearchLocation className="icon" />
                <input type="text" placeholder="Return Location" />
              </div>

              {/* Pickup Date & Time */}
              <div className="input-field-car">
                <BsFillCalendarDateFill className="icon" />
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

              {/* Return Date & Time */}
              <div className="input-field-car">
                <BsFillCalendarDateFill className="icon" />
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

              <button className="search-btn-car" onClick={handleSearch}>Search →</button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default CarRental;