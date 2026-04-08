// src/pages/MyAppointments.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAdmin } from '../context/adimContext';
import { assets } from '../assets/assets';
import { IoArrowBack } from 'react-icons/io5';
const MyAppointments = () => {
  const navigate = useNavigate();
  const { axios, user } = useAdmin(); // user is boolean true when logged in
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/my-appointments' } });
    }
  }, [user, navigate]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data } = await axios.get('/api/appointments/my-appointments', {
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
  }, [user, axios]);

  // Cancel appointment
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
        setAppointments(prev =>
          prev.map(app =>
            app._id === appointmentId ? { ...app, status: 'cancelled' } : app
          )
        );
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

  // Placeholder for payment processing – integrate with your payment gateway
  const handlePayment = async (appointment) => {
    toast.info('Payment integration coming soon');
    // Example: redirect to payment page or open modal
    // navigate(`/payment/${appointment._id}`);
  };

  // Format date to "DD Month, YYYY"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Format time from timeSlot object
  const formatTime = (timeSlot) => {
    if (!timeSlot) return '';
    return timeSlot.start; // e.g., "10:00 AM"
  };

  // Helper to get address string from doctor object
  const getAddressString = (address) => {
    if (!address) return 'Address not available';
    const { line1, line2, city, state } = address;
    return `${line1 || ''} ${line2 || ''}, ${city || ''}, ${state || ''}`.replace(/\s+/g, ' ').trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your appointments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <button
                                onClick={() => {
                                  navigate('/');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                  className="inline-flex items-center ml-2 mt-0 justify-center gap-2 text-primary font-medium hover:text-primary-dull transition-all duration-300 self-start md:self-auto transition group-hover:translate-x-1"
                              >
                               <div className="group inline-flex items-center mb-4 cursor-pointer">
                              <IoArrowBack className="w-7 h-7 transition-transform duration-200  group-hover:-translate-x-1" />
                              <span className="ml-1"> </span>
                            </div>
                               
                              </button>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          My Appointments
        </h1>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">
              You have no appointments scheduled.
            </p>
            <button
              onClick={() => navigate('/doctors')}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Doctors
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const isActive = !['cancelled', 'completed'].includes(appointment.status);
              const isPaid = appointment.payment?.status === 'paid';
              const isUnpaid = appointment.payment?.status === 'unpaid' && isActive;

              return (
                <div
                  key={appointment._id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
                >
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    {/* Doctor Image */}
                    <div className="md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={appointment.doctor?.image || assets.doctor_placeholder}
                        alt={appointment.doctor?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-2">
                      <h2 className="text-xl font-semibold text-gray-900">
                         {appointment.doctor?.name}
                      </h2>
                      <p className="text-gray-600">{appointment.doctor?.specialty}</p>
                      <div className="text-gray-700 text-sm space-y-1">
                        <p className="flex items-start gap-2">
                          <span className="font-medium min-w-[70px]">Address:</span>
                          <span>{getAddressString(appointment.doctor?.address)}</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="font-medium min-w-[70px]">Date & Time:</span>
                          <span>
                            {formatDate(appointment.date)} | {formatTime(appointment.timeSlot)}
                          </span>
                        </p>
                      </div>
                      {/* Payment status badge */}
                      {isPaid && (
                        <span className="inline-block mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                          Paid {appointment.payment?.method === 'online' ? 'Online' : ''}
                        </span>
                      )}
                      {isUnpaid && (
                        <span className="inline-block mt-2 text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                          Payment Pending
                        </span>
                      )}
                    </div>

                    {/* Actions (Cancel & Pay) */}
                    <div className="flex flex-col justify-center items-end gap-3">
                      {isActive ? (
                        <>
                          {/* {isUnpaid && (
                            <button
                              onClick={() => handlePayment(appointment)}
                              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/85 transition font-medium text-sm"
                            >
                              Pay Now
                            </button>
                          )} */}
                         {appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointment.payment?.method !== 'online' && (
  <button
    onClick={() => handleCancel(appointment._id)}
    disabled={cancellingId === appointment._id}
    className="px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {cancellingId === appointment._id ? 'Cancelling...' : 'Cancel appointment'}
  </button>
)}
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          {appointment.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;