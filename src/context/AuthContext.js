import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");

      if (userToken && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      const mockUser = {
        id: "1",
        email: email,
        name: "John Doe",
        avatar: null,
      };

      const mockToken = "mock-jwt-token-" + Date.now();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store auth data
      await AsyncStorage.setItem("userToken", mockToken);
      await AsyncStorage.setItem("userData", JSON.stringify(mockUser));

      setUser(mockUser);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: "Invalid credentials" };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.fullName,
        avatar: null,
      };

      const mockToken = "mock-jwt-token-" + Date.now();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store auth data
      await AsyncStorage.setItem("userToken", mockToken);
      await AsyncStorage.setItem("userData", JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error("Sign up error:", error);
      return { success: false, error: "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);

      // Clear stored auth data
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, error: "Failed to send reset email" };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
