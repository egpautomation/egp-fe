// @ts-nocheck

import { createContext, useEffect, useState, ReactNode } from "react";
import * as authService from "@/lib/authService";
import type { User, RegisterData } from "@/lib/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  getToken: () => string | null;
  isAuthenticated: boolean;
  refetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Login user with email and password
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authService.login(email, password);
      
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  /**
   * Login user via Google OAuth
   */
  const googleLogin = async (idToken: string): Promise<void> => {
    try {
      const response = await authService.googleLogin(idToken);
      
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Google Login error:", error);
      throw error;
    }
  };

  /**
   * Register new user
   */
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      const response = await authService.register(userData);
      
      // If registration returns token and user, set them
      if (response.data?.user) {
        setUser(response.data.user);
      } else {
        // If registration doesn't auto-login, login the user
        await login(userData.email, userData.password);
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = (): void => {
    authService.logout();
    setUser(null);
  };

  /**
   * Get current access token
   */
  const getToken = (): string | null => {
    return authService.getAccessToken();
  };

  /**
   * Refetch user data from stored user data
   */
  const refetchUser = async (): Promise<void> => {
    const userData = authService.getUserData();
    if (userData) {
      setUser(userData);
    }
  };

  /**
   * Check authentication status on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is authenticated
        const isAuth = authService.isAuthenticated();
        
        if (isAuth) {
          // Get user data from localStorage
          const userData = authService.getUserData();
          
          if (userData) {
            setUser(userData);
          } else {
            // Token exists but no user data, clear tokens
            authService.clearTokens();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        authService.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    googleLogin,
    register,
    logout,
    setUser,
    getToken,
    isAuthenticated: authService.isAuthenticated(),
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
