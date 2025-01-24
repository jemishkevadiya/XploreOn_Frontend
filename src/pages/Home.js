import React from "react";
import Navbar from "../components/Navbar"; // Import Navbar for the top navigation
import "../styles/Home.css"; // Import the styles for the Home screen

const Home = () => {
  const backgroundImage = "/images/home_screen.jpg"; // Path to your background image

  return (
    <div className="home">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section-container">
        <div
          className="hero-section"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          {/* Text Content */}
          <div className="hero-content">
            <h1 className="hero-title">
              Experience streamlined access to all four services in one platform
              <br />
              <span className="highlighted-text">PERSONALIZED ITINERARY GENERATOR</span>
            </h1>
            {/* Booking Now Button */}
            <button className="booking-button">
              <span className="button-icon">
                <img src="/images/icon-car.png" alt="Car Icon" />
              </span>
              Booking Now
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-container">
        <h2 className="services-title">Our Services</h2>
        <p className="services-subtitle">
          Discover a variety of options tailored to your travel needs, including flights,
          car rentals, hotels, and more.
        </p>
        <div className="cards-container">
          {/* Card 1 */}
          <div className="service-card">
            <img
              src="/images/flight.png"
              alt="Flights"
              className="service-card-image"
            />
            <h3 className="service-card-title">Flights</h3>
            <button>Explore Flights</button>
          </div>
          {/* Card 2 */}
          <div className="service-card">
            <img
              src="/images/carrentals.png"
              alt="Car Rentals"
              className="service-card-image"
            />
            <h3 className="service-card-title">Car Rentals</h3>
            <button>Rent a Car</button>
          </div>
          {/* Card 3 */}
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

      {/* Itinerary Generator Section */}
      <div className="itinerary-container">
        <h2 className="itinerary-title">Itinerary Generator</h2>
        <p className="itinerary-subtitle">
          Create personalized itineraries with flights, car rentals, and hotel
          bookings—all tailored to your preferences.
        </p>
        <div className="itinerary-steps">
          {/* Step 1 */}
          <div className="itinerary-step">
            <img
              src="/images/calender_picture.png"
              alt="Step 1"
              className="itinerary-step-icon"
            />
            <p className="itinerary-text">Choose Your Destination</p>
          </div>
          {/* Step 2 */}
          <div className="itinerary-step">
            <img
              src="/images/destination-picture.png"
              alt="Step 2"
              className="itinerary-step-icon"
            />
            <p className="itinerary-text">Pick Travel Dates</p>
          </div>
          {/* Step 3 */}
          <div className="itinerary-step">
            <img
              src="/images/Money_picture.png"
              alt="Step 3"
              className="itinerary-step-icon"
            />
            <p className="itinerary-text">Get Your Itinerary</p>
          </div>
        </div>
        <button className="itinerary-button">Start Planning</button>
      </div>

      {/* About Us Section */}
      <div className="about-us-container">
        <h2 className="about-title">About Us</h2>
        <p className="about-description">
          At XploreOn, we strive to make travel seamless and enjoyable. From flights
          and hotels to personalized itineraries, we provide everything you need for
          a memorable trip.
        </p>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-container">
        <h2 className="testimonials-title">What Our Customers Say</h2>
        <div className="testimonials-cards">
          {/* Testimonial Card 1 */}
          <div className="testimonial-card">
            <p>"XploreOn made my trip planning so easy. Highly recommend!"</p>
            <span>- John Doe</span>
          </div>
          {/* Testimonial Card 2 */}
          <div className="testimonial-card">
            <p>"Great service and amazing deals on hotels and car rentals."</p>
            <span>- Jane Smith</span>
          </div>
          {/* Testimonial Card 3 */}
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
