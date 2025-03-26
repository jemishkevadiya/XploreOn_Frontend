import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Itinerary.css";
import Footer from "../components/Footer";

const Itinerary = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('itineraryFormData');
        return savedData ? JSON.parse(savedData) : {
            origin: "",
            destination: "",
            fromDate: "",
            toDate: "",
            services: [],
            budget: "",
            dietaryPreference: "",
            adults: 1,
            childrenAges: "",
            preference: "cheap" 
        };
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        localStorage.setItem('itineraryFormData', JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleServiceChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData({ ...formData, services: [...formData.services, value] });
        } else {
            setFormData({
                ...formData,
                services: formData.services.filter((service) => service !== value),
            });
        }
    };

    const handlePreferenceChange = (preference) => {
        setFormData({ ...formData, preference });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.services.includes("Restaurant")) {
            const validPreferences = ["vegetarian", "non-vegetarian"];
            if (!formData.dietaryPreference || !validPreferences.includes(formData.dietaryPreference.toLowerCase())) {
                setError("Please select a dietary preference (Vegetarian or Non-Vegetarian) when Restaurant is selected.");
                return;
            }
        }

        const adultsInt = parseInt(formData.adults, 10);
        if (isNaN(adultsInt) || adultsInt < 1) {
            setError("Adults must be a number greater than or equal to 1.");
            return;
        }

        const budgetNum = formData.budget ? parseFloat(formData.budget) : "";

        const updatedFormData = {
            ...formData,
            adults: adultsInt,
            budget: budgetNum,
        };

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/itinerary/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Raw response:", text);
                throw new Error(`Failed to generate itinerary: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            navigate("/itinerary/results", { state: { itinerary: data, formData: updatedFormData } });
        } catch (err) {
            setError(err.message);
            console.error("Error details:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="itinerary-page">
            <h1 className="page-title">Plan Your Journey with XploreOn</h1>
            <form onSubmit={handleSubmit} className="itinerary-form">
                <div className="form-group">
                    <label>Origin</label>
                    <input
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleInputChange}
                        placeholder="e.g., Mumbai"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Destination</label>
                    <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="e.g., Calgary"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>From Date</label>
                    <input
                        type="date"
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>To Date</label>
                    <input
                        type="date"
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Services</label>
                    <div className="checkbox-group">
                        {["Flight", "Hotel", "Car Rental", "Restaurant", "Tour"].map((service) => (
                            <label key={service} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    value={service}
                                    onChange={handleServiceChange}
                                    checked={formData.services.includes(service)}
                                />
                                {service}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Budget (CAD)</label>
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="e.g., 5000"
                    />
                    <div className="form-group toggle-group">
                    <label>Preference</label>
                    <div className="toggle-container">
                        <button
                            type="button"
                            className={`toggle-button ${formData.preference === "cheap" ? "active" : ""}`}
                            onClick={() => handlePreferenceChange("cheap")}
                        >
                            Cheap
                        </button>
                        <button
                            type="button"
                            className={`toggle-button ${formData.preference === "best" ? "active" : ""}`}
                            onClick={() => handlePreferenceChange("best")}
                        >
                            Best
                        </button>
                    </div>
                </div>
                </div>

                <div className="form-group">
                    <label>Dietary Preference (if Restaurant selected)</label>
                    <select
                        name="dietaryPreference"
                        value={formData.dietaryPreference}
                        onChange={handleInputChange}
                    >
                        <option value="">Select</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="non-vegetarian">Non-Vegetarian</option>
                    </select>
                </div>

                <div className="form-group travelers-group">
                    <label>Travelers</label>
                    <div className="travelers-inputs">
                        <div className="input-subgroup">
                            <label className="sub-label">Adults</label>
                            <input
                                type="number"
                                name="adults"
                                value={formData.adults}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className="input-subgroup">
                            <label className="sub-label">Children Ages (comma-separated, e.g., 5,7)</label>
                            <input
                                type="text"
                                name="childrenAges"
                                value={formData.childrenAges}
                                onChange={handleInputChange}
                                placeholder="e.g., 5,7"
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? "Generating..." : "Generate Itinerary"}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}
            <Footer/>
        </div>
    );
};

export default Itinerary;