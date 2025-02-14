import React, { useState } from "react";
import "../styles/UserDashboard.css";


const dummyBookings = [
  { id: 1, type: "Flight", destination: "New York", date: "2025-03-15", status: "Upcoming" },
  { id: 2, type: "Hotel", destination: "Paris", date: "2024-12-22", status: "Completed" },
  { id: 3, type: "Car Rental", destination: "Toronto", date: "2025-01-10", status: "Upcoming" },
];

const Bookings = () => {
  const [bookings, setBookings] = useState(dummyBookings);

  const handleCancel = (id) => {
    alert(`Cancel booking ID: ${id}`);
  };

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className={`booking-card ${booking.status.toLowerCase()}`}>
            <h3>{booking.type} - {booking.destination}</h3>
            <p>Date: {booking.date}</p>
            <p>Status: <span className={booking.status.toLowerCase()}>{booking.status}</span></p>
            {booking.status === "Upcoming" && (
              <button className="cancel-btn" onClick={() => handleCancel(booking.id)}>Cancel</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;
