import "../styles/Hotel.css";
import { FaSearchLocation, FaUserFriends } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Hotel = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleGuestChange = (type, operation) => {
    if (type === 'adults') {
      if (operation === "increment") setAdults(prev => prev + 1);
      if (operation === "decrement" && adults > 1) setAdults(prev => prev - 1);
    } else {
      if (operation === "increment") setChildren(prev => prev + 1);
      if (operation === "decrement" && children > 0) setChildren(prev => prev - 1);
    }
  };

  const backgroundImage = "/images/hotelmain.jpg";
  
  return (
    <div className="hotel-container">
      <div className="heroo-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <h1 className="main-title">Where every journey<br />becomes an adventure.</h1>
        
        <div className="search-bar-container">
          <div className="search-bar">
            <div className="input-field">
              <FaSearchLocation className="icon" />
              <input type="text" placeholder="Where you want to go?..." />
            </div>

            <div className="input-field">
              <BsFillCalendarDateFill className="icon" />
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                placeholderText="Check-in Date"
                className="date-picker-input"
                minDate={new Date()}
              />
            </div>

            <div className="input-field">
              <BsFillCalendarDateFill className="icon" />
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                placeholderText="Check-out Date"
                className="date-picker-input"
                minDate={startDate || new Date()}
              />
            </div>

            {/* Inline Guest Selector */}
            <div className="input-field guest-selector">
              <FaUserFriends className="icon" />
              <div className="guest-controls">
                <div className="guest-type">
                  <button 
                    className="guest-button" 
                    onClick={() => handleGuestChange('adults', 'decrement')}
                    disabled={adults <= 1}
                  >
                    -
                  </button>
                  <span className="guest-count">{adults} Adult{adults !== 1 && 's'}</span>
                  <button 
                    className="guest-button" 
                    onClick={() => handleGuestChange('adults', 'increment')}
                  >
                    +
                  </button>
                </div>
                <div className="guest-type">
                  <button 
                    className="guest-button" 
                    onClick={() => handleGuestChange('children', 'decrement')}
                    disabled={children <= 0}
                  >
                    -
                  </button>
                  <span className="guest-count">{children} Child{children !== 1 && 'ren'}</span>
                  <button 
                    className="guest-button" 
                    onClick={() => handleGuestChange('children', 'increment')}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button className="search-btn">Search →</button>
          </div>
        </div>

        <div className="stats">
          <span>200+ <br /> Destinations</span>
          <span>10,000+ <br /> Happy Customers</span>
          <span>100+ <br /> Experienced Guides</span>
        </div>
      </div>

      {/* Rest of your content remains same */}
    </div>
  );
};

export default Hotel;