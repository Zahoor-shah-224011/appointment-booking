// context/DoctorContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Configure axios defaults (adjust baseURL as needed)
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

const DoctorContext = createContext();

export const useDoctors = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctors must be used within a DoctorProvider');
  }
  return context;
};

export const DoctorProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);         // logged-in doctor
  const [doctors, setDoctors] = useState([]);         // list of all doctors (for admin/listing)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if doctor is already logged in (session from cookie)
  useEffect(() => {
    const checkDoctorSession = async () => {
      try {
        const { data } = await axios.get('/api/doctor/me'); // endpoint to get current doctor
        if (data.success) {
          setDoctor(data.doctor);
        } else {
          setDoctor(null);
        }
      } catch (err) {
        // If 401 or other error, just set doctor to null (not logged in)
        setDoctor(null);
      }
    };
    checkDoctorSession();
  }, []);

  // Fetch all doctors (if needed for listings)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/admin/doctors'); // adjust endpoint
        if (data.success) {
          setDoctors(data.doctors);
        } else {
          setError(data.message || 'Failed to fetch doctors');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Optional logout function (can be used directly, but also provided via setDoctor)
  const logout = async () => {
    try {
      await axios.post('/api/doctor/logout', {}, { withCredentials: true });
      setDoctor(null);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const value = {
    doctor,
    setDoctor,
    doctors,
    loading,
    error,
    axios,                // expose the configured axios instance
    logout,                // optional convenience
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};