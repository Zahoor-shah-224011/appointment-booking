// src/context/AdminContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in, object = user data
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    totalPatients: 0,
    latestAppointments: [],
  });
  const [loading, setLoading] = useState(true);

  // Check logged-in user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get("/api/user/me");
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
        } else {
          console.error("User check error:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  // Fetch admin dashboard stats only when user is logged in
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("/api/dashboard", {
          withCredentials: true,
        });
        console.log("Dashboard data:", data);
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        // Optionally show a toast
      }
    };
    if (user) {
      fetchDashboard();
    } else {
      // Reset stats when logged out
      setStats({
        totalDoctors: 0,
        totalAppointments: 0,
        totalPatients: 0,
        latestAppointments: [],
      });
    }
  }, [user]);

  const updateUser = (updatedUser) => {
  setUser(updatedUser);
};

  const value = {
    axios,
    user,
    setUser,
    stats,
    setStats,
    loading,
    updateUser,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};