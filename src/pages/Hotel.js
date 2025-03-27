import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Hotel.css";
import { FaSearchLocation, FaUserFriends } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Footer from "../components/Footer";


const ReviewCarousel = () => {
  const carouselRef = React.useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0].offsetWidth;
      carouselRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0].offsetWidth;
      carouselRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.offsetWidth;
        if (carouselRef.current.scrollLeft === maxScroll) {
          carouselRef.current.scrollLeft = 0;
        } else {
          scrollRight();
        }
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
                <br />⭐️⭐️⭐️⭐️⭐️
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
                <br />⭐️⭐️⭐️⭐️⭐️
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
                <br />⭐️⭐️⭐️⭐️⭐️
              </div>
            </div>
            <img src="../images/mexico.jpg" alt="Hotel" className="review-hotel-image" />
          </div>
          <div className="review-card">
            <p>“I couldn't have asked for a better stay! The hotel was modern and stylish, and the staff made us feel like VIPs. The room was quiet, spacious, and well-equipped.”</p>
            <div className="reviewer-info">
              <img src="../images/profileIcon.svg" alt="Reviewer" />
              <div>
                <br />
                <h4>BagaKara</h4>
                <span>Indonesia</span>
                <br />⭐️⭐️⭐️⭐️⭐️
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
                <br />⭐️⭐️⭐️⭐️⭐️
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


const Hotel = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

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

  const handleSearch = async () => {
    if (!location || !startDate || !endDate) {
      alert("Please fill in all fields: location, check-in date, and check-out date.");
      return;
    }

    try {
      const formattedCheckIn = startDate.toISOString().split("T")[0];
      const formattedCheckOut = endDate.toISOString().split("T")[0];

      navigate("/hoteldetails", {
        state: {
          location,
          checkIn: formattedCheckIn,
          checkOut: formattedCheckOut,
          adults,
          children, 
          rooms ,
        },
      });
    } catch (error) {
      console.error("Error during navigation setup:", error.message);
      alert(`An error occurred. Please try again. Error: ${error.message}`);
    }
  };

  const backgroundImage = "/images/hotelmain.jpg";

  return (
    <div className="hotel-container">
      <div className="heroo-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <h1 className="main-title">
          A place where comfort meets luxury<br />just like home, only better!
        </h1>

        <div className="search-bar-container">
          <div className="search-bar">
            <div className="input-field">
              <FaSearchLocation className="icon" />
              <input
                type="text"
                placeholder="Where you want to go?..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
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

            <div className="input-field guest-selector">
              <FaUserFriends className="icon" />
              <div className="guest-controls">
                <div className="guest-type">
                  <button
                    className="guest-button"
                    onClick={() => handleGuestChange("adults", "decrement")}
                    disabled={adults <= 1}
                  >
                    -
                  </button>
                  <span className="guest-count">
                    {adults} Adult{adults !== 1 && "s"}
                  </span>
                  <button
                    className="guest-button"
                    onClick={() => handleGuestChange("adults", "increment")}
                  >
                    +
                  </button>
                </div>
                <div className="guest-type">
                  <button
                    className="guest-button"
                    onClick={() => handleGuestChange("children", "decrement")}
                    disabled={children <= 0}
                  >
                    -
                  </button>
                  <span className="guest-count">
                    {children} Child{children !== 1 && "ren"}
                  </span>
                  <button
                    className="guest-button"
                    onClick={() => handleGuestChange("children", "increment")}
                  >
                    +
                  </button>
                </div>
                <div className="guest-type">
                  <button
                    className="guest-button"
                    onClick={() => handleGuestChange("rooms", "decrement")}
                    disabled={rooms <= 1}
                  >
                    -
                  </button>
                  <span className="guest-count">
                    {rooms} Room{rooms !== 1 && "s"}
                  </span>
                  <button
                    className="guest-button"
                    onClick={() => handleGuestChange("rooms", "increment")}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button className="search-btn" onClick={handleSearch}>
              Search →
            </button>
          </div>
        </div>
      </div>
      <ReviewCarousel />
      <Footer />
    </div>
  );
};

export default Hotel;