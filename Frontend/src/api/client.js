import axios from 'axios';

const API_URL = 'http://localhost:3000/api';
let currentToken = null;

export const setApiToken = (token) => {
  currentToken = token;
};

// Configure the base Axios instance
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to dynamically inject the in-memory JWT token
axiosClient.interceptors.request.use((config) => {
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Centralized error handler to extract specific backend messages
const handleApiError = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(error.message || 'An unexpected API error occurred');
};

export const api = {
  login: async (email, password) => {
    try {
      const res = await axiosClient.post('/auth/login', { email, password });
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
  
  register: async (email, password) => {
    try {
      const res = await axiosClient.post('/auth/register', { email, password });
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  getNotes: async () => {
    try {
      const res = await axiosClient.get('/notes');
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  createNote: async (title, encryptedContent, iv, authTag) => {
    try {
      const res = await axiosClient.post('/notes', { title, encryptedContent, iv, authTag });
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  deleteNote: async (id) => {
    try {
      const res = await axiosClient.delete(`/notes/${id}`);
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  }
};
