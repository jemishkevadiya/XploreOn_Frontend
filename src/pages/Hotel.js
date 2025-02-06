import React from "react";
import "../styles/Hotel.css";
import { FaSearchLocation, FaUserFriends } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReviewCarousel = () => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -1000, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 1000, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="review-carousel">
      <h2 className="review-heading">Let’s Hear How Their Experiences Use Our Platform</h2>
      <div className="carousel-container" ref={carouselRef}>
        <div className="carousel-track">
          <div className="review-card">
            <p>“As a business traveler, time is of the essence, and the hotel booking platform has been a time-saver. I can quickly search for nearby hotels.”</p>
            <div className="reviewer-info">
              <img src="../images/profileIcon.svg" alt="Reviewer" />
              <div>
                <h4>BagaKara</h4>
                <span>Indonesia</span>
              </div>
            </div>
            <img src="../images/mexico.jpg" alt="Hotel" className="review-hotel-image" />
          </div>
          <div className="review-card">
            <p>“As a business traveler, time is of the essence, and the hotel booking platform has been a time-saver. I can quickly search for nearby hotels.”</p>
            <div className="reviewer-info">
              <img src="../images/profileIcon.svg" alt="Reviewer" />
              <div>
                <h4>BagaKara</h4>
                <span>Indonesia</span>
              </div>
            </div>
            <img src="../images/mexico.jpg" alt="Hotel" className="review-hotel-image" />
          </div>

          <div className="review-card">
            <p>“As a business traveler, time is of the essence, and the hotel booking platform has been a time-saver. I can quickly search for nearby hotels.”</p>
            <div className="reviewer-info">
              <img src="../images/profileIcon.svg" alt="Reviewer" />
              <div>
                <h4>BagaKara</h4>
                <span>Indonesia</span>
              </div>
            </div>
            <img src="../images/mexico.jpg" alt="Hotel" className="review-hotel-image" />
          </div>

          <div className="review-card">
            <p>“As a business traveler, time is of the essence, and the hotel booking platform has been a time-saver. I can quickly search for nearby hotels.”</p>
            <div className="reviewer-info">
              <img src="../images/profileIcon.svg" alt="Reviewer" />
              <div>
                <h4>BagaKara</h4>
                <span>Indonesia</span>
              </div>
            </div>
            <img src="../images/mexico.jpg" alt="Hotel" className="review-hotel-image" />
          </div>

          <div className="review-card">
            <p>"I used to spend hours searching for hotels and comparing prices, but ever since I started using a hotel booking platform, it has simplified the entire process."</p>
            <div className="reviewer-info">
              <img src="../images/profileIcon.svg" alt="Reviewer" />
              <div>
                <h4>Steven Wart</h4>
                <span>USA</span>
              </div>
            </div>
            <img src="../images/vegas.jpg" alt="Hotel" className="review-hotel-image" />
          </div>
        </div>
      </div>
      <button className="prev-btn" onClick={scrollLeft}>←</button>
      <button className="next-btn" onClick={scrollRight}>→</button>
    </section>
  );
};




const DiscoverPlaces = () => {
  return (
    <section className="secondpage-hotel">
      <h2 className="staggered-heading">Explore best hotels</h2>
        <h2 className="staggered-subheading">
          Book your stay or personalized experience,
          <p>luxurious amenities, or a relaxing getaway, and</p>
          <p>take a step towards unforgettable memories.</p>
        </h2>

      <div className="discover-places-container">
        {/* Bangkok */}
        <div className="discover-place-card lower-card">
          <img src="../images/bangkok.jpg" alt="Bangkok hotel" className="image-frame" />
          <div className="discover-place-info">
            <h2 className="hotel-heading"> Mandarin Oriental</h2>
            <button className="book-now-btn"></button>
          </div>
        </div>

        {/* Germany */}
        <div className="discover-place-card higher-card">
          <img src="../images/vegas.jpg" alt="Germany" />
          <div className="discover-place-info">
            <h3>Wynn Las Vegas</h3>
            <button className="book-now-btn"></button>
          </div>
        </div>

        {/* Germany */}
        <div className="discover-place-card higher-card">
          <img src="../images/zighy_bay.jpg" alt="Germany" />
          <div className="discover-place-info">
            <h3>Six senses</h3>
            <button className="book-now-btn"></button>
          </div>
        </div>

        {/* France */}
        <div className="discover-place-card lower-card">
          <img src="../images/mexico.jpg" alt="France" />
          <div className="discover-place-info">
            <h3>Chable Yucatan</h3>
            <button className="book-now-btn"></button>
          </div>
        </div>
      </div>
    </section>
  );
};

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
                  <button className="guest-button" onClick={() => handleGuestChange('adults', 'decrement')} disabled={adults <= 1}>-</button>
                  <span className="guest-count">{adults} Adult{adults !== 1 && 's'}</span>
                  <button className="guest-button" onClick={() => handleGuestChange('adults', 'increment')}>+</button>
                </div>
                <div className="guest-type">
                  <button className="guest-button" onClick={() => handleGuestChange('children', 'decrement')} disabled={children <= 0}>-</button>
                  <span className="guest-count">{children} Child{children !== 1 && 'ren'}</span>
                  <button className="guest-button" onClick={() => handleGuestChange('children', 'increment')}>+</button>
                </div>
              </div>
            </div>

            <button className="search-btn">Search →</button>
          </div>
        </div>
      </div>
      <DiscoverPlaces />
      <ReviewCarousel/>
      <Footer/>
    </div>
     
  );
};

export default Hotel;