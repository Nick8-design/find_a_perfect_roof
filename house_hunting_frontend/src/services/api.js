import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Houses API
export const getHouses = async (filters = {}) => {
  const params = {};
  if (filters.location && filters.location.trim()) {
    params.location = filters.location.trim();
  }
  if (filters.maxRent) {
    params.maxRent = filters.maxRent;
  }
  if (filters.bedrooms && filters.bedrooms !== 'all') {
    params.bedrooms = filters.bedrooms;
  }

  const response = await apiClient.get('/houses', { params });
  return response.data;
};

export const getHouseById = async (id) => {
  const response = await apiClient.get(`/houses/${id}`);
  return response.data;
};

export const addHouse = async (houseData) => {
  const response = await apiClient.post('/houses', houseData);
  return response.data;
};

// Bookings API (PayPal integration)
export const createBookingOrder = async (bookingData) => {
  const response = await apiClient.post('/bookings/create-order', bookingData);
  return response.data;
};

export const captureBookingOrder = async (captureData) => {
  const response = await apiClient.post('/bookings/capture-order', captureData);
  return response.data;
};

export const cancelBookingOrder = async (cancelData) => {
  const response = await apiClient.post('/bookings/cancel-order', cancelData);
  return response.data;
};

// AI Chat Assistant API (Gemini integration)
export const sendChatMessage = async (message, conversationHistory = []) => {
  const response = await apiClient.post('/chat', {
    message,
    conversationHistory,
  });
  return response.data;
};

export default apiClient;

