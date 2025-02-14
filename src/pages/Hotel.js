import React from "react";
import "../styles/Hotel.css";
import { FaSearchLocation, FaUserFriends } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Footer from "../components/Footer";

const ReviewCarousel = () => {
  const carouselRef = useRef(null);

  // Scroll to the left by one card
  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0].offsetWidth; // Get the width of one card
      carouselRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  // Scroll to the right by one card
  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0].offsetWidth; // Get the width of one card
      carouselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        // Check if we've reached the end of the carousel and reset to the start
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.offsetWidth;
        if (carouselRef.current.scrollLeft === maxScroll) {
          // Reset to the beginning of the carousel
          carouselRef.current.scrollLeft = 0;
        } else {
          // Scroll to the right
          scrollRight();
        }
      }
    }, 3000); // Adjust the interval time as needed (in milliseconds)

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <section className="review-carousel">
      <h2 className="review-heading">Let’s Hear How Their Experiences Use Our Platform</h2>
      <div className="carousel-container" ref={carouselRef}>
        <div className="carousel-track">

          <div className="review-card">
            <p>“Amazing! I stayed here for a business trip, and it was the perfect choice. The conference facilities were great, and the Wi-Fi was fast and reliable.”</p>
            <div className="reviewer-info">
              <img src="../images/profileIcon.svg" alt="Reviewer" />
              <div>
                <h4>Kratos</h4>
                <span>Sparta</span>
              </div>
            </div>
            <img src="../images/review2.jpg" alt="Hotel" className="review-hotel-image" />
          </div>

          <div className="review-card">
            <p>“Amazing! I stayed here for a business trip, and it was the perfect choice. The conference facilities were great, and the Wi-Fi was fast and reliable.”</p>
            
            <div className="reviewer-info">
              <img src="../images/profileIcon.svg" alt="Reviewer" />
              <div>
                <h4>Sheikh</h4>
                <span>Saudi Arabia</span>
                <br/>⭐️⭐️⭐️⭐️⭐️
              </div>
            </div>
            <img src="../images/review2.jpg" alt="Hotel" className="review-hotel-image" />
          </div>

          <div className="review-card">
            <p>“A hidden gem! The hotel had a charming, boutique feel, and the attention to detail was exceptional. The room was cozy, and the bed was so comfortable.”</p>
            <div className="reviewer-info">
              <img src="../images/profileIcon.svg" alt="Reviewer" />
              <div>
                <h4>Daniel</h4>
                <span>Canada</span>
                <br/>⭐️⭐️⭐️⭐️⭐️
              </div>
            </div>
            <img src="../images/review3.jpg" alt="Hotel" className="review-hotel-image" />
          </div>

          <div className="review-card">
            <p>“As a business traveler, time is of the essence, and the hotel booking platform has been a time-saver. I can quickly search for nearby hotels.”</p>
            <div className="reviewer-info">
              <img src="../images/profileIcon.svg" alt="Reviewer" />
              <div>
                <h4>Martin</h4>
                <span>Chili</span>
                <br/>⭐️⭐️⭐️⭐️⭐️
              </div>
            </div>
            <img src="../images/mexico.jpg" alt="Hotel" className="review-hotel-image" />
          </div>

          <div className="review-card">
            <p>“I couldn't have asked for a better stay! The hotel was modern and stylish, and the staff made us feel like VIPs. The room was quiet, spacious, and well-equipped.” </p>
            <div className="reviewer-info">
              <img src="../images/profileIcon.svg" alt="Reviewer" />
              <div>
                <br/>
                <h4>BagaKara</h4>
                <span>Indonesia</span>
                <br/>⭐️⭐️⭐️⭐️⭐️
              </div>
            </div>
            <img src="../images/review4.jpg" alt="Hotel" className="review-hotel-image" />
          </div>

          <div className="review-card">
            <p>"Wonderful experience! The hotel is ideally located near all the tourist spots. The room was clean, well-appointed, and offered a stunning view of the city skyline"</p>
            <div className="reviewer-info">
              <img src="../images/profileIcon.svg" alt="Reviewer" />
              <div>
                <h4>Steven Wart</h4>
                <span>New Mexico</span>
                <br/>⭐️⭐️⭐️⭐️⭐️
              </div>
            </div>
            <img src="../images/review1.jpg" alt="Hotel" className="review-hotel-image" />
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
            
          </div>
        </div>

        {/* Tokyo */}
        <div className="discover-place-card higher-card">
          <img src="../images/ascott.jpg" alt="Tokyo" />
          <div className="discover-place-info">
            <h3>Ascott Marunouchi</h3>
            
          </div>
        </div>

        {/* Oman */}
        <div className="discover-place-card higher-card">
          <img src="../images/zighy_bay.jpg" alt="Oman" />
          <div className="discover-place-info">
            <h3>Six senses</h3>
            
          </div>
        </div>

        {/* Mexico */}
        <div className="discover-place-card lower-card">
          <img src="../images/mexico.jpg" alt="Mexico" />
          <div className="discover-place-info">
            <h3>Chable Yucatan</h3>
            
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
        <h1 className="main-title">A place where comfort meets luxury<br />just like home, only better!</h1>
        
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