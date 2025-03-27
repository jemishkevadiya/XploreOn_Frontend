import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [details, setDetails] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "/images/profileicon.svg",
    phone: "123456789", 
    dob: "2000-01-01", 
    address: "123 Street, XYZ City",
  });

  const [editField, setEditField] = useState(null);

  const handleEdit = (field) => {
    setEditField(field);
  };

  const handleChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

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
      console.log("Updated details:", details); 
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewPhoto(imageUrl); 
    }
  };

  const handleSavePhoto = async () => {
    try {
      if (newPhoto) {
        await updateProfile(auth.currentUser, { photoURL: newPhoto }); 
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
                  <button disabled>Edit</button> 
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
