import React from "react";
import "../styles/Flight.css";

const FlightPage = () => {
    return (
        <div className="flight-container">
            {/* Hero Section */}
            <header className="hero-section-flight">
                <h1 className="hero-title-flight">
                    Find And Book
                    <br />
                    A Great Experience </h1>
                <div className="hero-background-flight">
                    <img src="images/flight_bg.jpg" alt="Clouds" className="cloud-image" />
                </div>
                <img src="images/airplane_2.png" alt="Airplane" className="airplane-image" />

            </header>

            <section className="search-section">
                <div className="class-toggle">
                    <button className="toggle-button active">Economy</button>
                    <button className="toggle-button">Business Class</button>
                    <button className="toggle-button">First Class</button>
                </div>
                <div className="search-fields">
                    <div className="search-field">
                        <i className="icon location-icon"></i>
                        <input type="text" placeholder="Location" />
                    </div>
                    <div className="search-field">
                        <i className="icon travelers-icon"></i>
                        <input type="text" placeholder="Travelers" />
                    </div>
                    <div className="search-field">
                        <i className="icon checkin-icon"></i>
                        <input type="date" />
                    </div>
                    <div className="search-field">
                        <i className="icon checkout-icon"></i>
                        <input type="date" />
                    </div>
                    <button className="search-button">
                        <i className="icon search-icon"></i>
                    </button>
                </div>
            </section>

            {/* Travel Support Section */}
            <section className="travel-support">
                <h2 className="travel-support-title">Plan your travel with confidence</h2>
                <p className="travel-support-subtitle">
                    Find help with your bookings and travel plans, and see what to expect along your journey.
                </p>
                <div className="travel-support-layout">
                    {/* Left Side: Text */}
                    <div className="travel-support-left">
                        <div className="travel-feature">
                            <div className="feature-number">01</div>
                            <div>
                                <h3 className="feature-title">Travel requirements for Dubai</h3>
                                <p className="feature-description">
                                    Momondo is by far one of the best travel websites for sourcing travel deals.
                                </p>
                            </div>
                        </div>
                        <div className="travel-feature">
                            <div className="feature-number">02</div>
                            <div>
                                <h3 className="feature-title">Multi-risk travel insurance</h3>
                                <p className="feature-description">
                                    Momondo is by far one of the best travel websites for sourcing travel deals.
                                </p>
                            </div>
                        </div>
                        <div className="travel-feature">
                            <div className="feature-number">03</div>
                            <div>
                                <h3 className="feature-title">Travel requirements by destination</h3>
                                <p className="feature-description">
                                    Momondo is by far one of the best travel websites for sourcing travel deals.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Images */}
                    <div className="travel-support-right">
                        <img src="image1.jpg" alt="Travel 1" className="travel-image travel-image1" />
                        <img src="image2.jpg" alt="Travel 2" className="travel-image travel-image2" />
                        <img src="image3.jpg" alt="Travel 3" className="travel-image travel-image3" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FlightPage;
