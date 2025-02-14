import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">User Dashboard</h2>
      <ul className="sidebar-menu">
        <li 
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </li>
        <li 
          className={activeTab === "notifications" ? "active" : ""}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </li>
        <li 
          className={activeTab === "bookings" ? "active" : ""}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </li>
        <li 
          className={activeTab === "paymentHistory" ? "active" : ""}
          onClick={() => setActiveTab("paymentHistory")}
        >
          Payment History
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
