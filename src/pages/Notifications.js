import React, { useState } from "react";

const dummyNotifications = [
  { id: 1, message: "Your flight booking to New York is confirmed!", status: "unread" },
  { id: 2, message: "Hotel reservation in Paris has been updated.", status: "unread" },
  { id: 3, message: "Exclusive discount on car rentals for your next trip!", status: "read" },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(dummyNotifications);

  const markAsRead = (id) => {
    setNotifications(notifications.map((notif) =>
      notif.id === id ? { ...notif, status: "read" } : notif
    ));
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <ul className="notifications-list">
        {notifications.map((notif) => (
          <li key={notif.id} className={`notification-item ${notif.status}`}
          onClick={() => markAsRead(notif.id)}>
            <p>{notif.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
