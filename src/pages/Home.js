import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

class Home extends React.Component {
  render() {
    const backgroundImage = "/images/Home_Image.jpg"; // Background image path
    return (
      <div className="home">
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <div
          className="home-container"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="hero-content">
            <h1 className="hero-title">
              <span>Plan your</span>
              <br />
              <span>journey</span>
              <br />
              <span>beyond limits</span>
            </h1>
            <p className="hero-subtitle">“ Every trip, just the way you want it ”</p>
          </div>
        </div>

        {/* Services Section */}
        <div className="services-container">
          <h2 className="services-title">What Services Do We Offer?</h2>
          <p className="services-subtitle">
            Embark on your next great adventure today, where every journey becomes a story worth telling.
          </p>
          <div className="cards-container">
            <div className="service-card">
              <img src="/images/flight.png" alt="Flights"/>
              <h3 className="service-card-title">Flights</h3>
              <button>Book Now</button>
            </div>
            <div className="service-card">
              <img src="/images/hotels.png" alt="Hotels" />
              <h3 className="service-card-title">Hotels</h3>
              <button>Book Now</button>
            </div>
            <div className="service-card">
              <img src="/images/carrentals.png" alt="Car Rentals" />
              <h3 className="service-card-title">Car Rentals</h3>
              <button>Book Now</button>
            </div>
          </div>
        </div>

        {/* Itinerary Generator Section */}
        <div className="itinerary-container">
          <h2 className="itinerary-title">Personalized Itinerary Generator</h2>
          <p className="itinerary-subtitle">
            Experience streamlined access to all four services in one platform with our <strong>Personalized Itinerary Generator</strong>.
          </p>
          <div className="itinerary-steps">
            {/* Step 1 */}
            <div className="itinerary-step">
              <img src="/images/location-icon.png" alt="Location" />
              <p className="itinerary-text">Tell us where do you want to go?<br /><span>Select your desired location across the world</span></p>
            </div>
            {/* Step 2 */}
            <div className="itinerary-step">
              <img src="/images/calendar-icon.png" alt="Duration" />
              <p className="itinerary-text">Tell us the duration of the trip?<br /><span>How long would you like to go on your vacation for</span></p>
            </div>
            {/* Step 3 */}
            <div className="itinerary-step">
              <img src="/images/budget-icon.png" alt="Budget" />
              <p className="itinerary-text">Tell us the budget of your trip?<br /><span>Set a limit on your vacation spending</span></p>
            </div>
          </div>
          <button className="itinerary-button">LET'S PLAN YOUR TRIP</button>
        </div>

        {/* About Us Section */}
        <div className="about-us-container">
          <h2 className="about-title">About Us</h2>
          <p className="about-description">
            At XploreOn, we believe every journey should be memorable. From flights to hotels to car rentals, our platform provides everything you need for a seamless and stress-free travel experience.
          </p>
        </div>

        {/* Testimonials Section */}
        <div className="testimonials-container">
          <h2 className="testimonials-title">What Our Customers Say</h2>
          <div className="testimonials-cards">
            <div className="testimonial-card">
              <p>"XploreOn made my travel planning effortless. Highly recommend!"</p>
              <span>- Sarah M.</span>
            </div>
            <div className="testimonial-card">
              <p>"Excellent service and great deals. Will use again!"</p>
              <span>- John D.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
