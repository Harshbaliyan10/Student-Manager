import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/authApi";

// AuthContext - A React Context that stores authentication state (user info, token)
// and makes it available to every component in the app without passing props manually.
const AuthContext = createContext(null);

// AuthProvider - Wraps the entire app and provides auth state to all child components.
// It also restores the user's session from localStorage when the page is refreshed.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking localStorage on first load

  // useEffect (session restore) - Runs once on app startup to check if a token already exists
  // in localStorage. If it does, the user stays logged in without having to login again.
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // login - Calls the login API, saves the returned token and user info to state and localStorage
  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  };

  // register - Calls the register API, saves the returned token and user info to state and localStorage
  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  };

  // logout - Clears the user's session from both state and localStorage, sending them back to the login page
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuth - Custom hook that lets any component easily access the auth context (user, login, logout, etc.)
export const useAuth = () => useContext(AuthContext);
