import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  // State to manage user details
  const [details, setDetails] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "/images/profileicon.svg",
    phone: "123456789", // Default or fetched value
    dob: "2000-01-01", // Default or fetched value
    address: "123 Street, XYZ City", // Default or fetched value
  });

  const [editField, setEditField] = useState(null);

  // Handle editing a field
  const handleEdit = (field) => {
    setEditField(field);
  };

  // Handle changes to input fields
  const handleChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  // Save changes (Firebase only supports updating displayName & photoURL)
  const handleSave = async () => {
    try {
      if (editField === "name" || editField === "photoURL") {
        await updateProfile(auth.currentUser, {
          displayName: details.name,
          photoURL: details.photoURL,
        });
      }
      setEditField(null);
      alert("Profile updated successfully!");
      console.log("Updated details:", details); // Log for backend integration
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const [isEditingPhoto, setIsEditingPhoto] = useState(false); // Manage photo edit state
  const [newPhoto, setNewPhoto] = useState(null); // Hold new photo file

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewPhoto(imageUrl); // Display new photo as a preview
    }
  };

  const handleSavePhoto = async () => {
    try {
      if (newPhoto) {
        await updateProfile(auth.currentUser, { photoURL: newPhoto }); // Save the new photo URL
        setDetails((prev) => ({ ...prev, photoURL: newPhoto }));
        alert("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    } finally {
      setIsEditingPhoto(false);
    }
  };


  return (
    <div className="profile-section">
      <h2>Personal Details</h2>
      <p>Update your information</p>
      <div className="profile-content">
        {/* Profile Picture Section */}
        <div className="profile-picture">
          <img
            src={details.photoURL || "/images/profileicon.svg"}
            alt="Profile"
            className="profile-img"
          />
          {isEditingPhoto ? (
            <div className="edit-photo-container">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <button onClick={handleSavePhoto}>Save Photo</button>
              <button onClick={() => setIsEditingPhoto(false)}>Cancel</button>
            </div>
          ) : (
            <button
              className="edit-photo-btn"
              onClick={() => setIsEditingPhoto(true)}
            >
              Edit Photo
            </button>
          )}
        </div>
  
        {/* User Details Table */}
        <div className="profile-details">
          <table className="details-table">
            <tbody>
              <tr>
                <td>Name:</td>
                <td>
                  {editField === "name" ? (
                    <input
                      type="text"
                      value={details.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  ) : (
                    details.name
                  )}
                </td>
                <td>
                  {editField === "name" ? (
                    <button onClick={handleSave}>Save</button>
                  ) : (
                    <button onClick={() => handleEdit("name")}>Edit</button>
                  )}
                </td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{details.email}</td>
                <td>
                  <button disabled>Edit</button> {/* Email is not editable */}
                </td>
              </tr>
              <tr>
                <td>Phone:</td>
                <td>
                  {editField === "phone" ? (
                    <input
                      type="text"
                      value={details.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  ) : (
                    details.phone
                  )}
                </td>
                <td>
                  {editField === "phone" ? (
                    <button onClick={handleSave}>Save</button>
                  ) : (
                    <button onClick={() => handleEdit("phone")}>Edit</button>
                  )}
                </td>
              </tr>
              <tr>
                <td>Date of Birth:</td>
                <td>
                  {editField === "dob" ? (
                    <input
                      type="date"
                      value={details.dob}
                      onChange={(e) => handleChange("dob", e.target.value)}
                    />
                  ) : (
                    details.dob
                  )}
                </td>
                <td>
                  {editField === "dob" ? (
                    <button onClick={handleSave}>Save</button>
                  ) : (
                    <button onClick={() => handleEdit("dob")}>Edit</button>
                  )}
                </td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>
                  {editField === "address" ? (
                    <input
                      type="text"
                      value={details.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  ) : (
                    details.address
                  )}
                </td>
                <td>
                  {editField === "address" ? (
                    <button onClick={handleSave}>Save</button>
                  ) : (
                    <button onClick={() => handleEdit("address")}>Edit</button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
};

export default Profile;
