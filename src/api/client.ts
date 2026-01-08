import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { API_BASE_URL } from '../constants/config';
import { queryClient } from './queryClient';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      // Clear all cached data and auth state
      queryClient.clear();
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);
