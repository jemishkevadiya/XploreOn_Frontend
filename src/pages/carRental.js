import React, { useState } from "react";
import '../styles/carRental.css';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FaSearchLocation } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const CarRental = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [PickupDate, setPickupDate] = useState(new Date()); // <-- Set default to today's date and time
  const [ReturnDate, setReturnDate] = useState(new Date()); // <-- Set default to today's date and time

  const navigate = useNavigate();


  const handleSearch = () => {
    if (!PickupDate || !ReturnDate || !pickupLocation || !returnLocation) {
      alert("All the fiels are rwquired");
      return;
    }




  const pickUpDate = PickupDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const pickUpTime = PickupDate.toISOString().split('T')[1].slice(0, 5); // HH:mm

  const dropOffDate = ReturnDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const dropOffTime = ReturnDate.toISOString().split('T')[1].slice(0, 5); // HH:mm

  console.log("Pick-up Date:", pickUpDate);
  console.log("Pick-up Time:", pickUpTime);
  console.log("Drop-off Date:", dropOffDate);
  console.log("Drop-off Time:", dropOffTime);



    // Prepare the search parameters to send to the backend
    const carsearchParams = {
      pickupLocation,
      dropOffLocation: returnLocation,
      pickUpDate,    // YYYY-MM-DD
      dropOffDate,   // YYYY-MM-DD
      pickUpTime,    // HH:mm
      dropOffTime,   // HH:mm
      currencyCode: "CAD", // Example, you can adjust based on your needs
    };

    // Construct the query string and navigate
    navigate("/carrentaldetails", { state: carsearchParams });
   
  };

    const backgroundImage = "/images/carmain.jpg";

    return (
      <div className="hotel-container">
        <div className="heroo-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <h1 className="main-title-car">From Short Trips to Long Drives<br></br> We've Got You Covered</h1>
          
          <div className="search-bar-container-car">
          <div className="search-bar-car">
            {/* Pickup Location */}
            <div className="input-field-car">
              <FaSearchLocation className="icon" />
              <input
                type="text"
                placeholder="Pick-up Location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>

       {/* Return Location */}
       <div className="input-field-car">
              <FaSearchLocation className="icon" />
              <input
                type="text"
                placeholder="Return Location"
                value={returnLocation}
                onChange={(e) => setReturnLocation(e.target.value)}
              />
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