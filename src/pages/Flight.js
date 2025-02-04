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
                    A Great Experience
                </h1>
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

           {/* Trending Destinations Section */}
<section className="trending-destinations">
    <h2 className="section-title">Trending Destinations</h2>
    <div className="destination-grid">
        {/* Paris Card */}
        <div className="destination-card card-paris">
            <div className="destination-image-wrapper">
                <img src="images/paris.jpg" alt="Paris" className="destination-image" />
            </div>
            <h3 className="destination-name">Paris</h3>
            <p className="destination-description">The City of Light awaits with iconic landmarks and rich culture.</p>
        </div>

        {/* Alberta Card */}
        <div className="destination-card card-alberta">
            <div className="destination-image-wrapper">
                <img src="images/banff.jpg" alt="Alberta" className="destination-image" />
            </div>
            <h3 className="destination-name">Alberta</h3>
            <p className="destination-description">Experience the ultimate paradise.</p>
        </div>

        {/* Dubai Card (Previously Tokyo) */}
        <div className="destination-card card-dubai">
            <div className="destination-image-wrapper">
                <img src="images/dubai1.jpg" alt="Dubai" className="destination-image" />
            </div>
            <h3 className="destination-name">Dubai</h3>
            <p className="destination-description">Experience the stunning skyline and dynamic energy of Dubai, a city like no other.</p>
        </div>

        {/* New York Card */}
        <div className="destination-card card-nyc">
            <div className="destination-image-wrapper">
                <img src="images/nyc1.jpg" alt="New York" className="destination-image" />
            </div>
            <h3 className="destination-name">New York</h3>
            <p className="destination-description">Explore the bustling streets and towering skyscrapers of NYC.</p>
        </div>

        {/* Rome Card */}
        <div className="destination-card card-rome">
            <div className="destination-image-wrapper">
                <img src="images/rome3.jpg" alt="Rome" className="destination-image" />
            </div>
            <h3 className="destination-name">Rome</h3>
            <p className="destination-description">Step back in time with the ancient history and culture of Rome.</p>
        </div>

        {/* Tokyo Card (Previously Dubai) */}
        <div className="destination-card card-tokyo">
            <div className="destination-image-wrapper">
                <img src="images/tokyo.jpg" alt="Tokyo" className="destination-image" />
            </div>
            <h3 className="destination-name">Tokyo</h3>
            <p className="destination-description">Dive into the vibrant culture and technology hub of Japan.</p>
        </div>
    </div>
</section>



        </div>
    );
};

export default FlightPage;
