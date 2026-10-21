import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach Authorization Bearer token to all requests if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('housenest_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// Authentication & User Profile API
// ==========================================
export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await apiClient.put('/auth/profile', profileData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (resetData) => {
  const response = await apiClient.post('/auth/reset-password', resetData);
  return response.data;
};

// ==========================================
// Houses API
// ==========================================
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

// ==========================================
// Bookings API (PayPal & Tenancy)
// ==========================================
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

export const getMyBookings = async (userId) => {
  const params = userId ? { userId } : {};
  const response = await apiClient.get('/bookings/my-bookings', { params });
  return response.data;
};

export const triggerLeaseCheck = async () => {
  const response = await apiClient.post('/bookings/check-expirations');
  return response.data;
};

// ==========================================
// AI Chat Assistant API (Gemini integration)
// ==========================================
export const sendChatMessage = async (message, conversationHistory = [], userId = null) => {
  const response = await apiClient.post('/chat', {
    message,
    conversationHistory,
    userId,
  });
  return response.data;
};

export default apiClient;
