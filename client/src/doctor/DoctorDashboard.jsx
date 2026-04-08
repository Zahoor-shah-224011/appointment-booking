// src/pages/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAdmin } from '../context/adimContext';

// Icons (using simple emoji or you can replace with react-icons)
const StatsCard = ({ icon, label, value, bgColor }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border-l-4 ${bgColor}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const DoctorDashboard = () => {
  const { axios } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    earnings: 0,
    appointmentsCount: 0,
    patientsCount: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        axios.get('/api/doctor/dashboard', { withCredentials: true }),
        axios.get('/api/doctor/appointments?limit=5', { withCredentials: true }), // get only latest 5
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      } else {
        toast.error(statsRes.data.message || 'Failed to load stats');
      }

      if (appointmentsRes.data.success) {
        setRecentAppointments(appointmentsRes.data.appointments);
      } else {
        toast.error(appointmentsRes.data.message || 'Failed to load appointments');
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error(error.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const { data } = await axios.put(
        `/api/doctor/appointments/${id}/status`,
        { status },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        // Update local state
        setRecentAppointments((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status } : app))
        );
        // Also update stats if needed (e.g., earnings may change if completed)
        fetchDashboardData(); // simple refresh, or you can update optimistically
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with title */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon="💰"
            label="Earnings"
            value={`$${stats.earnings}`}
            bgColor="border-green-500"
          />
          <StatsCard
            icon="📅"
            label="Appointments"
            value={stats.appointmentsCount}
            bgColor="border-blue-500"
          />
          <StatsCard
            icon="👥"
            label="Patients"
            value={stats.patientsCount}
            bgColor="border-purple-500"
          />
        </div>

        {/* Latest Bookings */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Latest Bookings</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentAppointments.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No recent appointments.
              </div>
            ) : (
              recentAppointments.map((app) => (
                <div key={app._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <img
                      src={app.patient?.image || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=40&h=40&fit=crop'}
                      alt={app.patient?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {app.patient?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Booking on {formatDate(app.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {app.status === 'completed' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Completed
                      </span>
                    )}
                    {app.status === 'cancelled' && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        Cancelled
                      </span>
                    )}
                    {app.status !== 'completed' && app.status !== 'cancelled' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(app._id, 'completed')}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app._id, 'cancelled')}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;