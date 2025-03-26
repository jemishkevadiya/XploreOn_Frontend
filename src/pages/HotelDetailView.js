import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../styles/HotelDetailView.css";

const SkeletonHotelDetail = () => {
  return (
    <div className="hotel-detail-view_hotelview">
      <div className="hotel-detail-content_hotelview">
        {/* Hotel Name Skeleton */}
        <div className="skeleton skeleton-title"></div>
        {/* Location Skeleton */}
        <div className="skeleton skeleton-location"></div>

        {/* Top Section: Photos, Price, and Facilities */}
        <div className="top-section_hotelview">
          {/* Left Column: Photos */}
          <div className="left-column_hotelview">
            <div className="hotel-images_hotelview">
              <div className="hotel-images-layout_hotelview">
                {/* Main Photo Skeleton */}
                <div className="main-photo_hotelview">
                  <div className="skeleton skeleton-main-photo"></div>
                </div>
                {/* Smaller Photos Skeleton */}
                <div className="side-photos_hotelview">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="skeleton skeleton-side-photo"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Price and Facilities */}
          <div className="right-column_hotelview">
            {/* Price Section Skeleton */}
            <div className="price-section_hotelview">
              <div className="skeleton skeleton-price"></div>
              <div className="skeleton skeleton-taxes"></div>
              <div className="skeleton skeleton-button"></div>
            </div>
            {/* Facilities Section Skeleton */}
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

        {/* Room Overview Skeleton */}
        <div className="accessibility-section_hotelview">
          <div className="skeleton skeleton-section-title"></div>
          <div className="skeleton skeleton-text"></div>
        </div>

        {/* Highlights Skeleton */}
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

        {/* Important Information Skeleton */}
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
  const { arrivalDate, departureDate, guests, priceData, accessibilityLabel } = location.state || {};

  const [hotelDetails, setHotelDetails] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhotosModal, setShowPhotosModal] = useState(false);

  console.log("HotelDetailView params:", { hotelId, arrivalDate, departureDate, guests, priceData, accessibilityLabel });

  // Fetch hotel details
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        if (!hotelId || !arrivalDate || !departureDate) {
          throw new Error("Missing required parameters (hotelId, arrivalDate, or departureDate)");
        }

        console.log("Fetching hotel details with params:", {
          hotelId,
          arrivalDate,
          departureDate,
        });

        const response = await axios.get("http://localhost:1111/hotels/hotel-details", {
          params: {
            hotelId,
            arrivalDate,
            departureDate,
          },
        });

        console.log("Hotel Details API Response:", response.data);
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
  }, [hotelId, arrivalDate, departureDate]);

  // Fetch hotel photos
  useEffect(() => {
    const fetchHotelPhotos = async () => {
      try {
        if (!hotelId) {
          throw new Error("Missing hotelId for fetching photos");
        }

        console.log("Fetching hotel photos for hotelId:", hotelId);
        const response = await axios.get("http://localhost:1111/hotels/hotel-photos", {
          params: {
            hotelId,
          },
        });

        console.log("Hotel Photos API Response:", response.data);
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

  // Handle Book Now button click
  const handleBookNow = () => {
    navigate("/booking", {
      state: {
        hotelId,
        hotelName: hotelDetails?.hotel_name || "Unknown Hotel",
        arrivalDate,
        departureDate,
        guests,
        priceData,
        accessibilityLabel,
      },
    });
  };

  // Validate required state
  if (!priceData || !priceData.grossPrice || !priceData.currency) {
    console.log("Price information missing.");
    return <div>Error: Price information is missing.</div>;
  }

  if (loading) {
    console.log("Rendering loading state...");
    return <SkeletonHotelDetail />;
  }
  if (error) {
    console.log("Rendering error state:", error);
    return <div>Error: {error}</div>;
  }
  if (!hotelDetails) {
    console.log("No hotel details found.");
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

  // Use accessibilityLabel from location.state, or fallback to a default message
  const displayAccessibilityLabel = accessibilityLabel || "Accessibility information not available.";

  // Ensure we have at least 9 photos for the layout (1 main + 8 smaller photos)
  const displayedPhotos = photos.slice(0, 9); // Main photo + 8 smaller photos
  const remainingPhotosCount = photos.length - 9;

  return (
    <div className="hotel-detail-view_hotelview">
      {/* Main Content */}
      <div className="hotel-detail-content_hotelview">
        <h1>{hotel_name}</h1>
        <p className="location_hotelview">
          {address}, {city}, {country_trans}, {zip}
        </p>

        {/* Top Section: Photos, Price, and Facilities */}
        <div className="top-section_hotelview">
          {/* Left Column: Main Photo */}
          <div className="left-column_hotelview">
            {/* Hotel Images */}
            <div className="hotel-images_hotelview">
              {photos.length > 0 ? (
                <>
                  <div className="hotel-images-layout_hotelview">
                    {/* Main Photo (Left) */}
                    {displayedPhotos[0] && (
                      <div className="main-photo_hotelview">
                        <img
                          src={displayedPhotos[0].url}
                          alt="Main Hotel Image"
                          className="hotel-image_hotelview main-image_hotelview"
                        />
                      </div>
                    )}
                    {/* Smaller Photos (Right) */}
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

                  {/* Photos Modal */}
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

          {/* Right Column: Price Section and Facilities */}
          <div className="right-column_hotelview">
            <div className="price-section_hotelview">
              <h2>
                {priceData.currency}${priceData.grossPrice.toFixed(2)}
              </h2>
              {priceData.excludedPrice > 0 && (
                <p className="taxes-charges">
                  + {priceData.currency}${priceData.excludedPrice.toFixed(2)} taxes and charges
                </p>
              )}
              <button className="book-now-btn_hotelview" onClick={handleBookNow}>
                Book Now
              </button>
            </div>

            {/* Facilities - Moved to right column below price */}
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

        {/* Accessibility Label */}
        <div className="accessibility-section_hotelview">
          <h2>Room Overview</h2>
          <p>{displayAccessibilityLabel}</p>
        </div>

        {/* Highlights */}
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

        {/* Important Information */}
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