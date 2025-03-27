import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import "../styles/Bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      console.log("Logged-in UID:", user?.uid);

      if (!user) {
        setError("Please log in to view bookings.");
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        console.log("Fetch Token:", token);
        const response = await axios.get( `${process.env.REACT_APP_API_URL}/user/user/${user.uid}`||`http://localhost:1111/user/user/${user.uid}`, {
          headers: { authtoken: token },
        });
        console.log("Raw bookings response:", response.data);

        const formattedBookings = response.data.bookings.map((booking) => {
          const details = booking.bookingDetails || {};
          let formattedBooking = {
            id: booking._id,
            serviceType: booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1).replace("_", " "),
            totalAmount: booking.totalAmount || "N/A",
          };

          if (booking.serviceType === "flight") {
            formattedBooking = {
              ...formattedBooking,
              route: `${details.departureCity || "N/A"} to ${details.destinationCity || "N/A"}`,
              date: details.departureDate ? new Date(details.departureDate) : null,
              status: details.departureDate
                ? new Date(details.departureDate) < new Date()
                  ? "Completed"
                  : "Pending"
                : "N/A",
            };
          } else if (booking.serviceType === "car_rental") {
            formattedBooking = {
              ...formattedBooking,
              route: `${details.pickupLocation || "N/A"} to ${details.dropOffLocation || "N/A"}`,
              dateRange: `${details.pickUpDate ? new Date(details.pickUpDate).toLocaleDateString() : "N/A"} - ${
                details.dropOffDate ? new Date(details.dropOffDate).toLocaleDateString() : "N/A"
              }`,
              status: details.pickUpDate
                ? new Date(details.pickUpDate) < new Date()
                  ? "Completed"
                  : "Pending"
                : "N/A",
            };
          } else if (booking.serviceType === "hotel") {
            formattedBooking = {
              ...formattedBooking,
              hotelName: details.hotelName || "N/A",
              dateRange: `${details.checkIn ? new Date(details.checkIn).toLocaleDateString() : "N/A"} - ${
                details.checkOut ? new Date(details.checkOut).toLocaleDateString() : "N/A"
              }`,
              status: details.checkIn
                ? new Date(details.checkIn) < new Date()
                  ? "Completed"
                  : "Pending"
                : "N/A",
            };
          }

          return formattedBooking;
        }).sort((a, b) => (b.date || b.dateRange) - (a.date || a.dateRange));

        console.log("Formatted bookings:", formattedBookings);
        if (!formattedBookings.length) setError("No bookings found for this user.");
        setBookings(formattedBookings);
      } catch (err) {
        console.error("Fetch error:", err.message, err.response?.data);
        setError("Failed to load bookings: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError("Log in first");
      return;
    }

    try {
      const token = await user.getIdToken();
      console.log("Cancel User ID:", user.uid, "Booking ID:", id);
      console.log("Cancel Token:", token);
      const url =  `${process.env.REACT_APP_API_URL}/user/cancel/${id}`||`http://localhost:1111/user/cancel/${id}`;
      console.log("Hitting:", url);
      const response = await axios.delete(url, {
        headers: { authtoken: token },
      });
      console.log("Success:", response.data);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      alert(response.data.message);
    } catch (err) {
      console.log("Error status:", err.response?.status);
      console.log("Error message:", err.response?.data?.message || err.message);
      setError("Cancel failed: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="bookings-container">Loading...</div>;
  if (error) return <div className="bookings-container">{error}</div>;

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className={`bookings-card ${booking.status.toLowerCase()}`}>
            <h3>{booking.serviceType}</h3>
            {console.log("Rendering booking:", booking)}
            {booking.serviceType.toLowerCase().includes("flight") && (
              <>
                <p>Route: {booking.route || "N/A"}</p>
                <p>Date: {booking.date ? booking.date.toLocaleDateString() : "N/A"}</p>
              </>
            )}
            {booking.serviceType.toLowerCase().includes("car") && (
              <>
                <p>Route: {booking.route || "N/A"}</p>
                <p>Dates: {booking.dateRange || "N/A"}</p>
              </>
            )}
            {booking.serviceType.toLowerCase().includes("hotel") && (
              <>
                <p>Hotel: {booking.hotelName || "N/A"}</p>
                <p>Dates: {booking.dateRange || "N/A"}</p>
              </>
            )}
            <p>Amount: ${booking.totalAmount}</p>
            <p>
              Status: <span className={booking.status.toLowerCase()}>{booking.status}</span>
            </p>
            {booking.status === "Pending" && (
              <button
                className="bookings-cancel-btn"
                onClick={() => handleCancel(booking.id)}
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;