import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

if (!API_URL) {
  throw new Error(" REACT_APP_BACKEND_URL is not defined in environment variables.");
}

export const createCheckoutSession = async (items, serviceType, email, userId, bookingId) => {
  try {
    if (!items || !serviceType || !email || !userId || !bookingId) {
      throw new Error(" Missing required fields: items, serviceType, email, userId, or bookingId.");
    }

    const response = await axios.post(`${API_URL}/payment/checkout-session`, {
      items,
      serviceType,
      email,
      userId,
      bookingId,
    });

    return response.data.checkoutUrl;
  } catch (error) {
    console.error(" Error creating checkout session:", error.response?.data || error.message);
    throw error;
  }
};
