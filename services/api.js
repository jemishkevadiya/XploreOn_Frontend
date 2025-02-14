import axios from "axios";

const API_BASE_URL = "/flights"; 

export const fetchAirportSuggestions = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAirportSuggestions`, {
            params: { query },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching airport suggestions:", error);
        throw error;
    }
};

export const fetchFlightSearchResults = async (searchParams) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/searchFlights`, {
            params: searchParams,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching flight search results:", error);
        throw error;
    }
};
const API_BASE_URL_CAR = "/car_rental"; // Change this to match your backend route

// Function to search for car rentals based on the pickup and drop-off locations, dates, and other parameters
export const searchCarRentals = async (searchParams) => {
    try {
        const response = await axios.get(`${API_BASE_URL_CAR}/search`, {
            params: searchParams, // Pass the necessary parameters for the car rental search
        });
        return response.data; // Returning the car rental search results
    } catch (error) {
        console.error("Error fetching car rentals:", error);
        throw error;
    }
};