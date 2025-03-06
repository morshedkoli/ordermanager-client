import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validateToken = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST_LINK}/auth/validate`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.valid;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const isValid = await validateToken(token);
        if (isValid) {
          setUser({ token });
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          logout();
        }
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("authToken", userData.token);
    localStorage.setItem("loginTime", new Date().getTime());
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("user");
  };

  // Add axios interceptor to handle unauthorized responses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Check session expiry every minute
    const sessionCheckInterval = setInterval(() => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime) {
        const currentTime = new Date().getTime();
        const sessionDuration = currentTime - parseInt(loginTime);
        // Session expires after 24 hours
        if (sessionDuration > 24 * 60 * 60 * 1000) {
          logout();
        }
      }
    }, 60000);

    return () => {
      axios.interceptors.response.eject(interceptor);
      clearInterval(sessionCheckInterval);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
