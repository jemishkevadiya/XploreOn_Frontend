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

export const createFlightBooking = async (payload) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/flightbooking`, payload);
        return response;
    }catch(error){
        console.error("Error fetching flight search results:", error);
        throw error;
    }
}