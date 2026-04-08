// src/admin/AllAppointments.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAdmin } from '../context/adimContext';
import { assets } from '../assets/assets';

const AllAppointments = () => {
  const { axios } = useAdmin();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/appointments/admin/all', {
          withCredentials: true,
        });
        if (data.success) {
          // Show only active appointments (pending/confirmed) – adjust as needed
          const active = data.appointments.filter(
            (app) => app.status === 'pending' || app.status === 'confirmed'
          );
          setAppointments(active);
        } else {
          toast.error(data.message || 'Failed to load appointments');
        }
      } catch (error) {
        console.error('Fetch appointments error:', error);
        toast.error(error.response?.data?.message || 'Server error');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [axios]);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Cancel this appointment?')) return;
    setCancellingId(appointmentId);
    try {
      const { data } = await axios.put(
        `/api/appointments/${appointmentId}/cancel`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Appointment cancelled');
        setAppointments((prev) => prev.filter((app) => app._id !== appointmentId));
      } else {
        toast.error(data.message || 'Failed to cancel');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error(error.response?.data?.message || 'Server error');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDateTime = (dateString, timeSlot) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const ordinal = (n) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    const time = timeSlot?.start || '';
    return `${ordinal(day)} ${month}, ${year}, ${time}`;
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 text-xl">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className=" lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Appointments</h1>
      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        {appointments.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xl">
            No active appointments found.
          </div>
        ) : (
          <div className="overflow-x-auto mx-9">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Age</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Doctor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fees</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {appointments.map((appt, idx) => (
                  <tr key={appt._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={appt.patient?.image || assets.profile_pic}
                          alt={appt.patient?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-900">
                          {appt.patient?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      {appt.doctor?.specialty || 'N/A'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      {calculateAge(appt.patient?.dob)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      {formatDateTime(appt.date, appt.timeSlot)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={appt.doctor?.image || assets.doctor_placeholder}
                          alt={appt.doctor?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-gray-900">{appt.doctor?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${appt.doctor?.fees || 0}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleCancel(appt._id)}
                        disabled={cancellingId === appt._id}
                        className="text-red-500 hover:text-red-600 text-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Cancel appointment"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;