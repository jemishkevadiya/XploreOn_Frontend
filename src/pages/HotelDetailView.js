import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import "../styles/HotelDetailView.css";

const HotelDetailView = () => {
  const { hotelId } = useParams();
  const location = useLocation();
  const { arrivalDate, departureDate, guests } = location.state || {};

  const [hotelDetails, setHotelDetails] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("HotelDetailView params:", { hotelId, arrivalDate, departureDate, guests });


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

  if (loading) {
    console.log("Rendering loading state...");
    return <div>Loading hotel details, please wait...</div>;
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

  return (
    <div className="hotel-detail-view_hotelview">

      <div className="hotel-detail-content_hotelview">
        <h1>{hotel_name}</h1>
        <p className="location_hotelview">
          {address}, {city}, {country_trans}, {zip}
        </p>


        <div className="hotel-images_hotelview">
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <img
                key={index}
                src={photo.url}
                alt={`Hotel Image ${index + 1}`}
                className="hotel-image_hotelview"
              />
            ))
          ) : (
            <p>No images available at this time.</p>
          )}
        </div>


        <div className="facilities-section_hotelview">
          <h2>Facilities</h2>
          {facilities_block?.facilities?.length > 0 ? (
            <ul>
              {facilities_block.facilities.map((facility, index) => (
                <li key={index}>{facility.name}</li>
              ))}
            </ul>
          ) : (
            <p>No facilities available at this time.</p>
          )}
        </div>


        <div className="highlights-section_hotelview">
          <h2>Property Highlights</h2>
          {property_highlight_strip?.length > 0 ? (
            <ul>
              {property_highlight_strip.map((highlight, index) => (
                <li key={index}>{highlight.name}</li>
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
                <li key={index}>{info.phrase}</li>
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