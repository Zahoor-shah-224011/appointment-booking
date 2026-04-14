// src/pages/AppointmentBooking.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../context/adimContext';
import { assets } from '../assets/assets';
import {
  FaStar,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaClipboardList,
  FaCalendarAlt,
  FaClock,
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
  FaUserMd,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AppointmentBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, user } = useAdmin();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('offline');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [days, setDays] = useState([]);
  const [isBooking, setIsBooking] = useState(false);

  // Patient details
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setPatientDetails(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        age: user.age || '',
        gender: user.gender || 'Male',
      }));
    }
  }, [user]);

  // Fetch doctor
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(`/api/doctor/${id}`);
        if (data.success) setDoctor(data.doctor);
      } catch (error) {
        toast.error('Failed to load doctor');
        navigate('/doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, axios, navigate]);

  // Generate next 7 days
  useEffect(() => {
    const today = new Date();
    const next7 = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      next7.push({
        date,
        dayName: date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
        dayNum: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
      });
    }
    setDays(next7);
  }, []);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  const handlePatientChange = (e) => {
    setPatientDetails({ ...patientDetails, [e.target.name]: e.target.value });
  };

  const createAppointment = async (paymentStatus) => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }
    setIsBooking(true);
    try {
      const res = await axios.post('/api/appointments/book', {
        doctorId: doctor._id,
        date: selectedDate.fullDate,
        timeSlot: { start: selectedTime, end: selectedTime },
        paymentMethod,
        paymentStatus,
      }, { withCredentials: true });
      if (res.data.success) {
        toast.success('Appointment booked successfully');
        navigate('/my-appointments');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsBooking(true);
    try {
      const { data } = await axios.post('/api/payments/create-checkout-session', {
        doctorId: doctor._id,
        doctorName: doctor.name,
        amount: doctor.fees,
        appointmentData: {
          date: selectedDate.fullDate,
          timeSlot: { start: selectedTime, end: selectedTime },
        },
      }, { withCredentials: true });
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error('Payment initiation failed');
        setIsBooking(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment error');
      setIsBooking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time slot');
      return;
    }
    if (paymentMethod === 'online') {
      handleOnlinePayment();
    } else {
      createAppointment('unpaid');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading doctor details...</div>
      </div>
    );
  }
  if (!doctor) return <div className="min-h-screen flex items-center justify-center">Doctor not found</div>;

  const cleanName = doctor.name?.startsWith('Dr.') ? doctor.name : `Dr. ${doctor.name}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition">←</span>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Two‑column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Doctor Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden  top-24">
            <div className="p-6">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img
                    src={doctor.image || assets.doctor_placeholder}
                    alt={doctor.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: 'center 15%' }}
                    onError={(e) => (e.target.src = assets.doctor_placeholder)}
                  />
                  <img
                    src={assets.verified_icon}
                    alt="Verified"
                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full p-0.5"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{cleanName}</h2>
                  <p className="text-sm text-gray-500">{doctor.specialty || doctor.speciality}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <FaMapMarkerAlt className="w-3 h-3 text-indigo-500" />
                    <span>{doctor.city || 'Lahore, Pakistan'}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`w-4 h-4 ${i < (doctor.rating || 4) ? 'text-yellow-500' : 'text-gray-300'}`} />
                ))}
                <span className="text-sm text-gray-600 ml-1">({doctor.rating || 4.5}/5)</span>
              </div>

              {/* Qualifications */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-start gap-2">
                  <FaGraduationCap className="w-4 h-4 mt-0.5 text-indigo-500" />
                  <span>MBBS, Completed FCPS Residency in Nephrology</span>
                </div>
                <div className="flex items-start gap-2">
                  <FaClipboardList className="w-4 h-4 mt-0.5 text-indigo-500" />
                  <span>Preparing for FCPS2 exam</span>
                </div>
              </div>

              {/* Fee */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Consultation Fee</p>
                <p className="text-3xl font-bold text-primary">${doctor.fees || 50}</p>
              </div>
            </div>
          </div>

          {/* Right column: Booking Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Book Appointment</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">Patient Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={patientDetails.name}
                      onChange={handlePatientChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={patientDetails.age}
                      onChange={handlePatientChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={patientDetails.gender}
                      onChange={handlePatientChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={patientDetails.phone}
                      onChange={handlePatientChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">Select Date & Time</h4>
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-3 min-w-max">
                    {days.map((day) => (
                      <button
                        key={day.fullDate}
                        type="button"
                        onClick={() => setSelectedDate(day)}
                        className={`flex flex-col items-center px-4 py-2 rounded-xl border transition ${
                          selectedDate?.fullDate === day.fullDate
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <span className="text-xs font-medium">{day.dayName}</span>
                        <span className="text-xl font-bold">{day.dayNum}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                        selectedTime === time
                          ? 'bg-primary text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-500'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <h4 className="text-md font-medium text-gray-700">Payment Method</h4>
                <div className="flex gap-4">
                  <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 flex-1 transition">
                    <input
                      type="radio"
                      value="offline"
                      checked={paymentMethod === 'offline'}
                      onChange={() => setPaymentMethod('offline')}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <FaMoneyBillWave className="text-green-600" />
                    <span className="text-sm">Pay at Clinic</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 flex-1 transition">
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <FaCreditCard className="text-indigo-600" />
                    <span className="text-sm">Pay Online</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isBooking}
                className="w-full py-3 bg-primary text-white rounded-xl text-lg font-semibold hover:bg-indigo-700 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isBooking ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">...</svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Confirm & {paymentMethod === 'online' ? 'Pay' : 'Book'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;