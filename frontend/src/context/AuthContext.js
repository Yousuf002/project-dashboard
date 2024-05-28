import axios from "axios";
import PropTypes from "prop-types"; // Add this import
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Set the token in axios headers
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          // Verify token with backend
          await axios.get("http://localhost:5000/user/verify-token");
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("User is not authenticated", error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Add prop types validation
};

export { AuthContext, AuthProvider };
