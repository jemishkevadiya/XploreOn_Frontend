import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

class Home extends React.Component {
  render() {
    const backgroundImage = "/images/Home_Image.jpg"; // Background image path
    return (
      <div className="home">
        {/* Background Container */}
        <div
          className="home-container"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          {/* Navbar */}
          <Navbar />

          {/* Hero Section */}
          <div className="hero-content">
            <h1 className="hero-title">Plan your journey beyond limits</h1>
            <p className="hero-subtitle">“ Every trip, just the way you want it ”</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
