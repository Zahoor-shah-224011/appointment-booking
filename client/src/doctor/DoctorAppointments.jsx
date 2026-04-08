// src/doctor/DoctorAppointments.jsx
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/adimContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const DoctorAppointments = () => {
  const { axios } = useAdmin();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all appointments for this doctor
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get('/api/doctor/appointments', {
          withCredentials: true,
        });
        if (data.success) {
          setAppointments(data.appointments);
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

  // Update appointment status (completed / cancelled)
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId);
    try {
      const { data } = await axios.put(
        `/api/doctor/appointments/${appointmentId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(`Appointment marked as ${newStatus}`);
        // Update local state
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === appointmentId ? { ...app, status: newStatus } : app
          )
        );
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper: calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // Helper: format date and time
  const formatDateTime = (dateString, timeSlot) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const time = timeSlot?.start || '';
    return `${day} ${month} ${year}, ${time}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 text-xl">Loading appointments...</div>
      </div>
    );
  }

  return (
    <>
      {/* Fixed Heading – no extra wrapper that could break layout */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="p-6 lg:p-8">
          <h1 className="text-3xl font-bold text-gray-900">All Appointments</h1>
        </div>
      </div>

      {/* Table Container – uses overflow-x-auto for horizontal scroll on small screens */}
      <div className="p-6 lg:p-8 overflow-x-auto">
        <div className="bg-white rounded-2xl shadow border border-gray-200 min-w-[800px] md:min-w-full">
          {appointments.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-xl">
              No appointments found.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Age</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fees</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
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
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                          appt.payment?.method === 'online'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {appt.payment?.method === 'online' ? 'Online' : 'CASH'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      {calculateAge(appt.patient?.dob)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      {formatDateTime(appt.date, appt.timeSlot)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${appt.doctor?.fees || 0}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      {appt.status === 'completed' && (
                        <span className="text-green-600 text-2xl font-bold">✔</span>
                      )}
                      {appt.status === 'cancelled' && (
                        <span className="text-red-600 text-2xl font-bold">✖</span>
                      )}
                      {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleStatusUpdate(appt._id, 'completed')}
                            disabled={updatingId === appt._id}
                            className="text-green-600 hover:text-green-800 text-2xl font-bold disabled:opacity-50"
                            title="Mark as completed"
                          >
                            ✔
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appt._id, 'cancelled')}
                            disabled={updatingId === appt._id}
                            className="text-red-600 hover:text-red-800 text-2xl font-bold disabled:opacity-50"
                            title="Cancel appointment"
                          >
                            ✖
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorAppointments;