import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../styles/HotelDetailView.css";

const SkeletonHotelDetail = () => {
  return (
    <div className="hotel-detail-view_hotelview">
      <div className="hotel-detail-content_hotelview">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-location"></div>
        <div className="top-section_hotelview">
          <div className="left-column_hotelview">
            <div className="hotel-images_hotelview">
              <div className="hotel-images-layout_hotelview">
                <div className="main-photo_hotelview">
                  <div className="skeleton skeleton-main-photo"></div>
                </div>
                <div className="side-photos_hotelview">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="skeleton skeleton-side-photo"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="right-column_hotelview">
            <div className="price-section_hotelview">
              <div className="skeleton skeleton-price"></div>
              <div className="skeleton skeleton-taxes"></div>
              <div className="skeleton skeleton-button"></div>
            </div>
            <div className="facilities-section_hotelview">
              <div className="skeleton skeleton-section-title"></div>
              <ul>
                {Array.from({ length: 6 }).map((_, index) => (
                  <li key={index}>
                    <span className="skeleton skeleton-icon"></span>
                    <span className="skeleton skeleton-text"></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="accessibility-section_hotelview">
          <div className="skeleton skeleton-section-title"></div>
          <div className="skeleton skeleton-text"></div>
        </div>
        <div className="highlights-section_hotelview">
          <div className="skeleton skeleton-section-title"></div>
          <ul>
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index}>
                <span className="skeleton skeleton-icon"></span>
                <span className="skeleton skeleton-text"></span>
              </li>
            ))}
          </ul>
        </div>
        <div className="important-info-section_hotelview">
          <div className="skeleton skeleton-section-title"></div>
          <ul>
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index}>
                <span className="skeleton skeleton-icon"></span>
                <span className="skeleton skeleton-text-long"></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const HotelDetailView = () => {
  const { hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { checkIn, checkOut, adults, children, rooms, priceData, accessibilityLabel } = location.state || {};

  const [hotelDetails, setHotelDetails] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        if (!hotelId || !checkIn || !checkOut) {
          throw new Error("Missing required parameters (hotelId, checkIn, or checkOut)");
        }

        const response = await axios.get("http://localhost:1111/hotels/hotel-details", {
          params: {
            hotelId,
            arrivalDate: checkIn,
            departureDate: checkOut,
          },
        });

        if (response.data.status) {
          setHotelDetails(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch hotel details");
        }
      } catch (err) {
        console.error("Error fetching hotel details:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [hotelId, checkIn, checkOut]);

  useEffect(() => {
    const fetchHotelPhotos = async () => {
      try {
        if (!hotelId) {
          throw new Error("Missing hotelId for fetching photos");
        }
        const response = await axios.get("http://localhost:1111/hotels/hotel-photos", {
          params: { hotelId },
        });

        if (response.data.status) {
          setPhotos(response.data.data || []);
        } else {
          throw new Error(response.data.message || "Failed to fetch hotel photos");
        }
      } catch (err) {
        console.error("Error fetching hotel photos:", err.message);
        setPhotos([]);
      }
    };

    fetchHotelPhotos();
  }, [hotelId]);

  const handleBookNow = async () => {
    setIsBooking(true);
    setError(null);
  
    const user = localStorage.getItem("user");
    if (!user) {
      setError("Please sign in to proceed with booking.");
      navigate("/signin");
      setIsBooking(false);
      return;
    }
  
    let userObject;
    try {
      userObject = JSON.parse(user);
    } catch (e) {
      console.error("Step 2: Error parsing user data:", e);
      setError("Invalid user data. Please sign in again.");
      navigate("/signin");
      setIsBooking(false);
      return;
    }
  
    const uid = userObject.uid;
    if (!uid) {
      console.error("Step 2: User ID not found in user object:", userObject);
      setError("User ID not found. Please sign in again.");
      navigate("/signin");
      setIsBooking(false);
      return;
    }
  
    if (!priceData || !priceData.grossPrice || !priceData.excludedPrice || !priceData.currency) {
      console.error("Step 3: Invalid price data:", priceData);
      setError("Invalid price data. Please try again.");
      setIsBooking(false);
      return;
    }
  
    const numberOfRooms = rooms || 1;
    const adjustedGrossPrice = parseFloat(priceData.grossPrice) * numberOfRooms;
    const adjustedExcludedPrice = parseFloat(priceData.excludedPrice) * numberOfRooms;
    const totalAmount = parseFloat((adjustedGrossPrice + adjustedExcludedPrice).toFixed(2)); 
  
    if (isNaN(totalAmount) || totalAmount <= 0) {
      console.error("Step 3: Invalid total amount:", totalAmount);
      setError("Invalid total amount. Please try again.");
      setIsBooking(false);
      return;
    }
  
    const hotelDetailsPayload = {
      hotelId,
      hotelName: hotelDetails?.hotel_name || "Unknown Hotel",
      arrivalDate: checkIn,
      departureDate: checkOut,
      adults,
      children: children || 0,
      rooms: numberOfRooms,
    };
  
    const payload = {
      hotelDetails: hotelDetailsPayload,
      totalAmount,
      userId: uid,
    };
  
    try {
      const response = await axios.post("http://localhost:1111/hotels/create-hotel-booking", payload);
  
      if (response.status === 201 && response.data.paymentUrl) {
        if (!response.data.paymentUrl.startsWith("https://checkout.stripe.com/")) {
          console.error("Step 6: Invalid payment URL format:", response.data.paymentUrl);
          setError("Invalid payment URL received. Please try again.");
          return;
        }
        window.location.href = response.data.paymentUrl; 
      } else {
        console.error("Step 5: No payment URL in response:", response.data);
        setError("Error creating hotel booking. No payment URL received.");
      }
    } catch (e) {
      console.error("Step 5: Error during booking:", e.response || e);
      setError(e.response?.data?.message || "Error booking hotel. Please try again!");
    } finally {
      setIsBooking(false);
    }
  };

  if (!checkIn || !checkOut || !priceData) {
    return <div>Error: Missing required booking information. Please go back and try again.</div>;
  }

  if (!priceData || !priceData.grossPrice || !priceData.currency) {
    return <div>Error: Price information is missing.</div>;
  }

  if (rooms === undefined) {
    return <div>Error: Rooms information is missing.</div>;
  }

  if (loading) {
    return <SkeletonHotelDetail />;
  }

  if (error && !isBooking) {
    return <div>Error: {error}</div>;
  }

  if (!hotelDetails) {
    return <div>No hotel details found. Please try again later.</div>;
  }

  const {
    hotel_name,
    address,
    city,
    country_trans,
    zip,
    facilities_block,
    property_highlight_strip,
    hotel_important_information_with_codes,
  } = hotelDetails;

  const displayAccessibilityLabel = accessibilityLabel || "Accessibility information not available.";
  const displayedPhotos = photos.slice(0, 9);
  const remainingPhotosCount = photos.length - 9;
  const numberOfRooms = rooms || 1;
  const adjustedGrossPrice = priceData.grossPrice * numberOfRooms;
  const adjustedExcludedPrice = priceData.excludedPrice * numberOfRooms;

  return (
    <div className="hotel-detail-view_hotelview">
      <div className="hotel-detail-content_hotelview">
        <h1>{hotel_name}</h1>
        <p className="location_hotelview">
          {address}, {city}, {country_trans}, {zip}
        </p>
        <div className="top-section_hotelview">
          <div className="left-column_hotelview">
            <div className="hotel-images_hotelview">
              {photos.length > 0 ? (
                <>
                  <div className="hotel-images-layout_hotelview">
                    {displayedPhotos[0] && (
                      <div className="main-photo_hotelview">
                        <img
                          src={displayedPhotos[0].url}
                          alt="Main Hotel Image"
                          className="hotel-image_hotelview main-image_hotelview"
                        />
                      </div>
                    )}
                    <div className="side-photos_hotelview">
                      {displayedPhotos.slice(1, 9).map((photo, index) => (
                        <div
                          key={index}
                          className={
                            index === 7 && remainingPhotosCount > 0
                              ? "more-photos-overlay_hotelview"
                              : ""
                          }
                        >
                          <img
                            src={photo.url}
                            alt={`Hotel Image ${index + 2}`}
                            className="hotel-image_hotelview side-image_hotelview"
                          />
                          {index === 7 && remainingPhotosCount > 0 && (
                            <div
                              className="more-photos-btn_hotelview"
                              onClick={() => setShowPhotosModal(true)}
                            >
                              +{remainingPhotosCount} photos
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {showPhotosModal && (
                    <div className="photos-modal_hotelview">
                      <div className="photos-modal-content_hotelview">
                        <button
                          className="close-modal-btn_hotelview"
                          onClick={() => setShowPhotosModal(false)}
                        >
                          Close
                        </button>
                        <div className="photos-modal-grid_hotelview">
                          {photos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo.url}
                              alt={`Hotel Image ${index + 1}`}
                              className="hotel-image_hotelview"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p>No images available at this time.</p>
              )}
            </div>
          </div>
          <div className="right-column_hotelview">
            <div className="price-section_hotelview">
              <h2>
                {priceData.currency}${adjustedGrossPrice.toFixed(2)}
              </h2>
              {adjustedExcludedPrice > 0 && (
                <p className="taxes-charges">
                  + {priceData.currency}${adjustedExcludedPrice.toFixed(2)} taxes and charges
                </p>
              )}
              {error && (
                <p className="error-text_hotelview" style={{ color: "red", margin: "10px 0" }}>
                  {error}
                </p>
              )}
              <button
                className="book-now-btn_hotelview"
                onClick={handleBookNow}
                disabled={isBooking}
              >
                {isBooking ? "Booking..." : "Book Now"}
              </button>
            </div>
            <div className="facilities-section_hotelview">
              <h2>Facilities</h2>
              {facilities_block?.facilities?.length > 0 ? (
                <ul>
                  {facilities_block.facilities.map((facility, index) => (
                    <li key={index}>
                      <span className="facility-icon">✔</span>
                      {facility.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No facilities available at this time.</p>
              )}
            </div>
          </div>
        </div>
        <div className="accessibility-section_hotelview">
          <h2>Room Overview</h2>
          <p>{displayAccessibilityLabel}</p>
        </div>
        <div className="highlights-section_hotelview">
          <h2>Property Highlights</h2>
          {property_highlight_strip?.length > 0 ? (
            <ul>
              {property_highlight_strip.map((highlight, index) => (
                <li key={index}>
                  <span className="highlight-icon">★</span>
                  {highlight.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No property highlights available at this time.</p>
          )}
        </div>
        <div className="important-info-section_hotelview">
          <h2>Important Information</h2>
          {hotel_important_information_with_codes?.length > 0 ? (
            <ul>
              {hotel_important_information_with_codes.map((info, index) => (
                <li key={index}>
                  <span className="info-icon">ℹ</span>
                  {info.phrase}
                </li>
              ))}
            </ul>
          ) : (
            <p>No important information available at this time.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetailView;