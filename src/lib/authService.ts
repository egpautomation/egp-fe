// Authentication Service - JWT Token Management
// Industry-standard JWT authentication utilities

import { jwtDecode } from 'jwt-decode';
import { config } from './config';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_DATA_KEY = 'userData';

// JWT Payload Interface
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

// User Interface
export interface User {
  _id: string;
  userId: number;
  name: string;
  email: string;
  role: string;
  district: string;
  address?: string;
  phone: string;
  whatsApp: string;
  walletBalance?: number;
}

// Login Response Interface
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken?: string;
    user: User;
  };
}

// Registration Data Interface
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  district: string;
  address?: string;
  phone: string;
  whatsApp: string;
  userId: number;
}

const API_BASE_URL = config.apiBaseUrl;

/**
 * Store tokens securely in localStorage
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token (optional)
 */
export const setTokens = (accessToken: string, refreshToken?: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Store user data in localStorage
 * @param user - User object
 */
export const setUserData = (user: User): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

/**
 * Get access token from localStorage
 * @returns Access token or null
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 * @returns Refresh token or null
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Get stored user data from localStorage
 * @returns User object or null
 */
export const getUserData = (): User | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Clear all authentication tokens and user data
 */
export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Decode JWT token and return payload
 * @param token - JWT token string
 * @returns Decoded payload or null
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns true if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Check if user is authenticated
 * @returns true if valid token exists, false otherwise
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;

  return !isTokenExpired(token);
};

/**
 * Login user with email and password
 * @param email - User email
 * @param password - User password
 * @returns Login response with token and user data
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    console.log('Login response:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Handle different response structures
    let token, refreshToken, user;

    // Check if response has nested data object
    if (data.data) {
      token = data.data.token;
      refreshToken = data.data.refreshToken;
      user = data.data.user;
    } else {
      // Direct response format
      token = data.token;
      refreshToken = data.refreshToken;
      user = data.user;
    }

    if (!token) {
      console.error('No token in response:', data);
      throw new Error('No authentication token received from server');
    }

    if (!user) {
      console.error('No user data in response:', data);
      throw new Error('No user data received from server');
    }

    // Store tokens and user data
    setTokens(token, refreshToken);
    setUserData(user);

    return {
      success: true,
      message: data.message || 'Login successful',
      data: {
        token,
        refreshToken,
        user
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Login user via Google OAuth
 * @param idToken - Google ID token
 * @returns Login response with token and user data
 */
export const googleLogin = async (idToken: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    console.log('Google Login response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Google Login failed');
    }

    let token, refreshToken, user;

    if (data.data) {
      token = data.data.token;
      refreshToken = data.data.refreshToken;
      user = data.data.user;
    } else {
      token = data.token;
      refreshToken = data.refreshToken;
      user = data.user;
    }

    if (!token) {
      throw new Error('No authentication token received from server');
    }

    if (!user) {
      throw new Error('No user data received from server');
    }

    // Store tokens and user data
    setTokens(token, refreshToken);
    setUserData(user);

    return {
      success: true,
      message: data.message || 'Login successful',
      data: {
        token,
        refreshToken,
        user
      }
    };
  } catch (error) {
    console.error('Google Login error:', error);
    throw error;
  }
};

/**
 * Register new user
 * @param userData - User registration data
 * @returns Registration response
 */
export const register = async (userData: RegisterData): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    console.log('Registration response:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Handle different response structures
    let token, refreshToken, user;

    // Check if response has nested data object
    if (data.data) {
      token = data.data.token;
      refreshToken = data.data.refreshToken;
      user = data.data.user;
    } else {
      // Direct response format
      token = data.token;
      refreshToken = data.refreshToken;
      user = data.user;
    }

    // Store tokens and user data if available
    if (token && user) {
      setTokens(token, refreshToken);
      setUserData(user);
    }

    return {
      success: true,
      message: data.message || 'Registration successful',
      data: {
        token: token || '',
        refreshToken,
        user: user || {} as User
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Logout user - clear all tokens and user data
 */
export const logout = (): void => {
  clearTokens();
};

/**
 * Refresh access token using refresh token
 * @returns New access token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    console.log('Refresh token response:', data); // Debug log

    if (!response.ok) {
      // Refresh token is invalid, clear all tokens
      clearTokens();
      return null;
    }

    // Handle different response structures
    let newToken, newRefreshToken;

    if (data.data) {
      newToken = data.data.token;
      newRefreshToken = data.data.refreshToken;
    } else {
      newToken = data.token;
      newRefreshToken = data.refreshToken;
    }

    // Store new access token
    if (newToken) {
      setTokens(newToken, newRefreshToken);
      return newToken;
    }

    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    clearTokens();
    return null;
  }
};

/**
 * Request password reset - sends reset token to user's email
 * @param email - User email address
 * @returns Success response
 */
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    console.log('Forgot password response:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send reset email');
    }

    return {
      success: true,
      message: data.message || 'Password reset link sent to your email'
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Reset password using token from email
 * @param token - Reset token from email link
 * @param newPassword - New password to set
 * @returns Success response
 */
export const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });

    const data = await response.json();

    console.log('Reset password response:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }

    return {
      success: true,
      message: data.message || 'Password reset successfully'
    };
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};
