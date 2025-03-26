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
        const response = await axios.get(`http://localhost:1111/user/user/${user.uid}`, {
          headers: { authtoken: token },
        });
        console.log("Raw bookings response:", response.data);

        const formattedBookings = response.data.bookings
          .map((booking) => ({
            id: booking._id,
            serviceType: booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1),
            departureCity: booking.bookingDetails?.departureCity || "N/A",
            destinationCity: booking.bookingDetails?.destinationCity || "N/A",
            departureDate: booking.bookingDetails?.departureDate
              ? new Date(booking.bookingDetails.departureDate)
              : null,
            totalAmount: booking.totalAmount || "N/A",
            status: booking.bookingDetails?.departureDate
              ? new Date(booking.bookingDetails.departureDate) < new Date()
                ? "Completed"
                : "Pending"
              : "N/A",
          }))
          .sort((a, b) => b.departureDate - a.departureDate);

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
      const url = `http://localhost:1111/user/cancel/${id}`;
      console.log("Hitting:", url);
      const response = await axios.delete(url, {
        headers: { authtoken: token },
      });
      console.log("Success:", response.data);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      alert(response.data.message); // Show refund message
    } catch (err) {
      console.log("Error status:", err.response?.status);
      console.log("Error message:", err.response?.data?.message || err.message);
      setError("Cancel failed: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="bookings-bro-container">Loading...</div>;
  if (error) return <div className="bookings-bro-container">{error}</div>;

  return (
    <div className="bookings-bro-container">
      <h2>My Bookings</h2>
      <div className="bookings-bro-list">
        {bookings.map((booking) => (
          <div key={booking.id} className={`bookings-bro-card ${booking.status.toLowerCase()}`}>
            <h3>{booking.serviceType}</h3>
            <p>
              Route:{" "}
              {booking.departureCity !== "N/A" && booking.destinationCity !== "N/A"
                ? `${booking.departureCity} to ${booking.destinationCity}`
                : booking.departureCity !== "N/A"
                ? booking.departureCity
                : booking.destinationCity}
            </p>
            <p>Date: {booking.departureDate ? booking.departureDate.toLocaleDateString() : "N/A"}</p>
            <p>Amount: ${booking.totalAmount}</p>
            <p>
              Status: <span className={booking.status.toLowerCase()}>{booking.status}</span>
            </p>
            {booking.status === "Pending" && (
              <button
                className="bookings-bro-cancel-btn"
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