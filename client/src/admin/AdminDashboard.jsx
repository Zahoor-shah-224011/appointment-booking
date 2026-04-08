// src/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { useAdmin } from "../context/adimContext";

const AdminDashboard = () => {
  const { axios } = useAdmin();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    totalPatients: 0,
    latestAppointments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("/api/dashboard", {
          withCredentials: true,
        });
        if (data.success) {
          setStats(data.data);
        } else {
          toast.error(data.message || "Failed to load dashboard");
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error(error.response?.data?.message || "Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [axios]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Doctors */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-6 hover:shadow-md transition">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&auto=format"
              alt="Doctor"
              className="w-12 h-12 object-cover rounded-full"
            />
          </div>
          <div>
            <p className="text-4xl lg:text-5xl font-bold text-gray-900">
              {stats.totalDoctors}
            </p>
            <p className="text-lg text-gray-600 mt-1">Doctors</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-6 hover:shadow-md transition">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={assets.appointment_img}
              alt="Appointments"
              className="w-12 h-12 object-cover"
            />
          </div>
          <div>
            <p className="text-4xl lg:text-5xl font-bold text-gray-900">
              {stats.totalAppointments}
            </p>
            <p className="text-lg text-gray-600 mt-1">Appointments</p>
          </div>
        </div>

        {/* Patients */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-6 hover:shadow-md transition">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={assets.group_profiles}
              alt="Patients"
              className="w-12 h-12 object-cover"
            />
          </div>
          <div>
            <p className="text-4xl lg:text-5xl font-bold text-gray-900">
              {stats.totalPatients}
            </p>
            <p className="text-lg text-gray-600 mt-1">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Appointments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Latest Appointments
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {stats.latestAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-lg">
              No recent appointments.
            </div>
          ) : (
            stats.latestAppointments.map((app) => (
              <div key={app.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                <img
                  src={app.doctorImage || assets.doctor_placeholder}
                  alt={app.doctorName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {app.doctorName}
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    {formatDateTime(app.bookingDate)}
                  </p>
                </div>

                {/* Status Icon */}
                <div>
                  {app.status === "completed" && (
                    <span className="text-green-600 text-2xl font-bold">✔</span>
                  )}
                  {app.status === "cancelled" && (
                    <span className="text-red-600 text-2xl font-bold">✖</span>
                  )}
                  {app.status !== "completed" && app.status !== "cancelled" && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;