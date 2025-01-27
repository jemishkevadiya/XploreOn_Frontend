import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css";
const Home = () => {
  const backgroundImage = "/images/home_screen.jpg";

  return (
    <div className="home">
      <Navbar />

      <div className="hero-section-container">
        <div
          className="hero-section"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          <div className="hero-content">
            <h1 className="hero-title">
              Experience streamlined access to all four services in one platform
              <br />
              <span className="highlighted-text">PERSONALIZED ITINERARY GENERATOR</span>
            </h1>
            <button className="booking-button">
              <span className="button-icon">
                <img src="/images/icon-car.png" alt="Car Icon" />
              </span>
              Booking Now
            </button>
          </div>
        </div>
      </div>

      <div className="services-container">
        <div className="services-container">
          <div className="services-text">
            <h2 className="services-title">Our Services</h2>
            <p className="services-subtitle">
              Discover an incredible array of travel options thoughtfully designed to cater to all your journey needs, whether you're booking flights, renting cars, reserving hotels, or planning every detail of your dream trip—all in one convenient platform for a truly seamless travel experience.
            </p>
          </div>
        </div>

        <div className="cards-container">

          <div className="service-card">
            <img
              src="/images/flight.png"
              alt="Flights"
              className="service-card-image"
            />
            <h3 className="service-card-title">Flights</h3>
            <button>Explore Flights</button>
          </div>

          <div className="service-card">
            <img
              src="/images/carrentals.png"
              alt="Car Rentals"
              className="service-card-image"
            />
            <h3 className="service-card-title">Car Rentals</h3>
            <button>Rent a Car</button>
          </div>

          <div className="service-card">
            <img
              src="/images/hotels.png"
              alt="Hotels"
              className="service-card-image"
            />
            <h3 className="service-card-title">Hotels</h3>
            <button>Book Hotels</button>
          </div>
        </div>
      </div>


      <div className="itinerary-container">
  <div className="itinerary-left">
    <img
      src="/images/itinerary-generator.jpeg"
      alt="Traveler on a beach"
      className="itinerary-image"
    />
  </div>
  <div className="itinerary-right">
    <div className="itinerary-header">
      <h2 className="itinerary-title">Itinerary Generator</h2>
      <p className="itinerary-description">
        Plan your trip effortlessly. Select your destination, dates, and preferences, and let us create the perfect itinerary for you.
      </p>
    </div>
    <div className="itinerary-content">
      <div className="itinerary-step">
        <img
          src="/images/location.png"
          alt="Destination"
          className="step-icon"
        />
        <h3 className="step-title">Select Destination</h3>
        <p className="step-description">
          Choose from a wide range of destinations to suit your travel goals.
        </p>
      </div>
      <div className="itinerary-step">
        <img
          src="/images/calendar.png"
          alt="Dates"
          className="step-icon"
        />
        <h3 className="step-title">Pick Travel Dates</h3>
        <p className="step-description">
          Add your travel dates to personalize your journey.
        </p>
      </div>
      <div className="itinerary-step">
        <img
          src="/images/budget1.png"
          alt="Budget"
          className="step-icon"
        />
        <h3 className="step-title">Set Preferences</h3>
        <p className="step-description">
          Tailor your trip to match your budget, interests, and style.
        </p>
      </div>
    </div>
    <button className="itinerary-button">Generate My Itinerary</button>
  </div>
</div>






      <div className="about-us-container">
        <h2 className="about-title">About Us</h2>
        <p className="about-description">
          At XploreOn, we strive to make travel seamless and enjoyable. From flights
          and hotels to personalized itineraries, we provide everything you need for
          a memorable trip.
        </p>
      </div>


      <div className="testimonials-container">
        <h2 className="testimonials-title">What Our Customers Say</h2>
        <div className="testimonials-cards">

          <div className="testimonial-card">
            <p>"XploreOn made my trip planning so easy. Highly recommend!"</p>
            <span>- John Doe</span>
          </div>

          <div className="testimonial-card">
            <p>"Great service and amazing deals on hotels and car rentals."</p>
            <span>- Jane Smith</span>
          </div>

          <div className="testimonial-card">
            <p>
              "The itinerary generator was a game-changer for my vacation."
            </p>
            <span>- Alex Brown</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
