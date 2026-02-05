// Axios Instance with JWT Interceptors
// Automatically handles token injection and refresh

import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, refreshAccessToken, clearTokens, isTokenExpired } from './authService';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: 'https://egpserver.jubairahmad.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Request Interceptor
 * Automatically attach JWT token to Authorization header
 */
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // When sending FormData (e.g. file upload), remove Content-Type so the browser
    // sets multipart/form-data with boundary. Otherwise default application/json
    // causes the server to not receive the file ("No PDF file uploaded").
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const token = getAccessToken();

    // If token exists and is not expired, attach to header
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token && isTokenExpired(token)) {
      // Token is expired, try to refresh
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`;
        }
      } catch (error) {
        // Refresh failed, clear tokens
        clearTokens();
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle 401 errors and trigger token refresh
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful response
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        if (newToken) {
          // Update the authorization header with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          processQueue(null, newToken);
          isRefreshing = false;

          // Retry the original request with new token
          return axiosInstance(originalRequest);
        } else {
          // Refresh failed, clear tokens and redirect to login
          processQueue(error, null);
          isRefreshing = false;
          clearTokens();
          
          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(error, null);
        isRefreshing = false;
        clearTokens();
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default axiosInstance;
