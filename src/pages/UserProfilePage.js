import React, { useState } from "react";
import Sidebar from "../pages/Sidebar";
import Profile from "../pages/Profile";
import Notifications from "../pages/Notifications";
import Bookings from "../pages/Bookings";
import PaymentHistory from "../pages/PaymentHistory";
import "../styles/UserDashboard.css"; // Importing CSS for layout

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Function to switch between sections
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "notifications":
        return <Notifications />;
      case "bookings":
        return <Bookings />;
      case "paymentHistory":
        return <PaymentHistory />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="user-dashboard">
      {/* Fixed Sidebar on the Left */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Dynamic Content Area on the Right */}
      <div className="content-area">{renderContent()}</div>
    </div>
  );
};

export default UserProfilePage;
