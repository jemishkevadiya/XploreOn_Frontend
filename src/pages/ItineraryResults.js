import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/ItineraryResults.css";

const ItineraryResults = () => {
  const location = useLocation();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItinerary(location.state?.itinerary || null);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.state]);

  if (loading) {
    return (
      <div className="itinerary-results-container">
        <div className="itinerary-results">
          <h2 className="skeleton skeleton-text skeleton-title"></h2>

          <div className="itinerary-section">
            <h3 className="skeleton skeleton-text skeleton-section-title"></h3>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
          </div>

          <div className="itinerary-section">
            <h3 className="skeleton skeleton-text skeleton-section-title"></h3>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
          </div>

          <div className="itinerary-section">
            <h3 className="skeleton skeleton-text skeleton-section-title"></h3>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
          </div>

          <div className="itinerary-section">
            <h3 className="skeleton skeleton-text skeleton-section-title"></h3>
            <div className="itinerary-item">
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-image"></div>
            </div>
            <div className="itinerary-item">
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-image"></div>
            </div>
          </div>

          <div className="itinerary-section">
            <h3 className="skeleton skeleton-text skeleton-section-title"></h3>
            <div className="skeleton skeleton-text skeleton-day-title"></div>
            <div className="itinerary-item">
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-image"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="itinerary-results-container">
        <div className="error-message">No itinerary data available. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="itinerary-results-container">
      <div className="itinerary-results">
        <h2>Your Itinerary</h2>

        {itinerary.flights && (
          <div className="itinerary-section">
            <h3>Flights</h3>
            <div className="itinerary-details">
              <div className="details-text">
                <p>
                  <strong>Price:</strong> {itinerary.flights.price} {itinerary.flights.currency}
                </p>
                <p>
                  <strong>Outbound:</strong> {itinerary.flights.outbound.airline} | Depart:{" "}
                  {new Date(itinerary.flights.outbound.departureTime).toLocaleString()} | Arrive:{" "}
                  {new Date(itinerary.flights.outbound.arrivalTime).toLocaleString()}
                </p>
                <p>
                  <strong>Return:</strong> {itinerary.flights.return.airline} | Depart:{" "}
                  {new Date(itinerary.flights.return.departureTime).toLocaleString()} | Arrive:{" "}
                  {new Date(itinerary.flights.return.arrivalTime).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {itinerary.hotels && (
          <div className="itinerary-section">
            <h3>Hotel</h3>
            <div className="itinerary-details">
              <div className="details-text">
                <p>
                  <strong>Name:</strong> {itinerary.hotels.name}
                </p>
                <p>
                  <strong>Price:</strong> {itinerary.hotels.price} {itinerary.hotels.currency}
                </p>
                <p>
                  <strong>Room:</strong> {itinerary.hotels.roomNumber}
                </p>
                <p>
                  <strong>Review Score:</strong> {itinerary.hotels.reviewScore || "N/A"}
                </p>
                <p>
                  <strong>Check-In:</strong> {itinerary.hotels.checkInDate}
                </p>
                <p>
                  <strong>Check-Out:</strong> {itinerary.hotels.checkOutDate}
                </p>
              </div>
            </div>
          </div>
        )}

        {itinerary.carRentals && (
          <div className="itinerary-section">
            <h3>Car Rental</h3>
            <div className="itinerary-details">
              <div className="details-text">
                <p>
                  <strong>Vehicle:</strong> {itinerary.carRentals.vehicle}
                </p>
                <p>
                  <strong>Supplier:</strong> {itinerary.carRentals.supplier}
                </p>
                <p>
                  <strong>Price:</strong> {itinerary.carRentals.price} {itinerary.carRentals.currency}
                </p>
              </div>
            </div>
          </div>
        )}

        {itinerary.restaurants && itinerary.restaurants.length > 0 && (
          <div className="itinerary-section">
            <h3>Restaurants</h3>
            {itinerary.restaurants.map((restaurant, index) => (
              <div key={index} className="itinerary-item">
                <div className="itinerary-details">
                  <div className="details-text">
                    <p>
                      <strong>Name:</strong> {restaurant.name}
                    </p>
                    <p>
                      <strong>Rating:</strong> {restaurant.averageRating}
                    </p>
                    <p>
                      <strong>Location:</strong> {restaurant.parentGeoName}
                    </p>
                    <p>
                      <strong>Tags:</strong> {restaurant.tags.join(", ")}
                    </p>
                  </div>
                  {restaurant.thumbnail && (
                    <div className="details-image">
                      <img src={restaurant.thumbnail} alt={restaurant.name} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {itinerary.tourPlaces && Object.keys(itinerary.tourPlaces).length > 0 && (
          <div className="itinerary-section">
            <h3>Tour Places</h3>
            {Object.keys(itinerary.tourPlaces).map((day) => (
              <div key={day} className="tour-day">
                <h4>{day}</h4>
                {itinerary.tourPlaces[day].map((tour, index) => (
                  <div key={index} className="itinerary-item">
                    <div className="itinerary-details">
                      <div className="details-text">
                        <p>
                          <strong>Name:</strong> {tour.name}
                        </p>
                        <p>
                          <strong>Description:</strong> {tour.description}
                        </p>
                      </div>
                      {tour.images && tour.images.length > 0 && (
                        <div className="details-image">
                          <img src={tour.images[0]} alt={tour.name} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {itinerary.messages && itinerary.messages.length > 0 && (
          <div className="itinerary-section">
            <h3>Messages</h3>
            {itinerary.messages.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryResults;